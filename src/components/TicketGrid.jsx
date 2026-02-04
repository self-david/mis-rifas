import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function TicketGrid({ occupiedTickets = [], selectedTickets = [], onToggleTicket, totalTickets = 100, startNumber = 1, digits = 2 }) {
    const tickets = Array.from({ length: totalTickets }, (_, i) => i + startNumber);

    return (
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            {tickets.map((number) => {
                const isOccupied = occupiedTickets.includes(number);
                const isSelected = selectedTickets.includes(number);

                return (
                    <button
                        key={number}
                        disabled={isOccupied}
                        onClick={() => onToggleTicket(number)}
                        className={cn(
                            "aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200",
                            isOccupied
                                ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50"
                                : isSelected
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-105 border border-indigo-400"
                                    : "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white hover:scale-105 hover:border-indigo-400 border border-indigo-500/20"
                        )}
                        title={isOccupied ? "Ocupado" : `Boleto ${number.toString().padStart(digits, '0')}`}
                    >
                        {number.toString().padStart(digits, '0')}
                    </button>
                );
            })}
        </div>
    );
}
