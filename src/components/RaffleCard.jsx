import React, { useState, useEffect } from 'react';
import { Calendar, Ticket } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function RaffleCard({ raffle }) {
    const [sheetOccupiedCount, setSheetOccupiedCount] = useState(0);

    useEffect(() => {
        if (!raffle.externalRegistrationLink) return;

        const fetchCount = async () => {
            try {
                const sheetIdMatch = raffle.externalRegistrationLink.match(/\/d\/(.*?)(\/|$)/);
                if (!sheetIdMatch) return;
                
                const sheetId = sheetIdMatch[1];
                const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

                const response = await fetch(csvUrl);
                if (!response.ok) return;
                
                const rows = text.split('\n').filter(line => line.trim()).map(row => {
                    const cols = [];
                    let start = 0;
                    let inQuotes = false;
                    for (let i = 0; i < row.length; i++) {
                        if (row[i] === '"') inQuotes = !inQuotes;
                        if (row[i] === ',' && !inQuotes) {
                            cols.push(row.substring(start, i).replace(/^"|"$/g, '').trim());
                            start = i + 1;
                        }
                    }
                    cols.push(row.substring(start).replace(/^"|"$/g, '').trim());
                    return cols;
                });

                // Get headers to find ticket index
                const headers = rows[0].map(h => h.toLowerCase().replace('.', '').replace(/\s/g, ''));
                const ticketIdx = headers.findIndex(h => h.includes('boleto'));
                
                const count = rows.slice(1).filter(row => {
                    const ticketVal = row[ticketIdx > -1 ? ticketIdx : 2];
                    const ticketNum = parseInt(ticketVal);
                    return !isNaN(ticketNum);
                }).length;
                
                setSheetOccupiedCount(count);
            } catch (e) {
                console.error("Error fetching count in card", e);
            }
        };

        fetchCount();
    }, [raffle.externalRegistrationLink]);

    const occupiedCount = raffle.externalRegistrationLink ? sheetOccupiedCount : raffle.occupiedTickets.length;
    const totalTickets = raffle.totalTickets || 100;
    const progress = (occupiedCount / totalTickets) * 100;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <a
            href={`/rifa/${raffle.id}`}
            className="group relative block overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20"
        >
            <div className="aspect-video w-full overflow-hidden">
                <img
                    src={raffle.image}
                    alt={raffle.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />
            </div>

            <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {raffle.title}
                </h3>

                <div className="mb-4 flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span>{formatDate(raffle.endDate)}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progreso</span>
                        <span className="font-medium text-indigo-400">{occupiedCount}/{totalTickets}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </a>
    );
}
