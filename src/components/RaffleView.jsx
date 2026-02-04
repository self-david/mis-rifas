import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download, Share2, Ticket, ExternalLink, Info, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import TicketGrid from './TicketGrid';
import { findWinner } from '../utils/raffleWinner';

export default function RaffleView({ raffle }) {
    const [selectedTickets, setSelectedTickets] = useState([]);
    const captureRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGridModal, setShowGridModal] = useState(false);
    
    // Google Sheet Data State
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(!!raffle.externalRegistrationLink);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!raffle.externalRegistrationLink) return;

        const fetchSheetData = async () => {
            try {
                // Convert typical Google Sheet edit URL to info/export URL
                const sheetIdMatch = raffle.externalRegistrationLink.match(/\/d\/(.*?)(\/|$)/);
                if (!sheetIdMatch) throw new Error("Invalid Google Sheet URL");
                
                const sheetId = sheetIdMatch[1];
                const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

                const response = await fetch(csvUrl);
                if (!response.ok) throw new Error("Failed to fetch sheet data");
                
                const text = await response.text();
                
                // Simple CSV Parser
                const rows = text.split('\n').map(row => {
                    // Handle quoted values if necessary, but simple split might verify basic structure first
                    // For robust parsing, regex is better, but this handles basic 'val,val,val'
                    const match = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
                    return match.map(val => val.replace(/^"|"$/g, '').trim());
                });

                // Assume header is first row: Nombre, GAP, No. Boleto
                const headers = rows[0].map(h => h.toLowerCase().replace('.', '').replace(/\s/g, ''));
                const nameIdx = headers.findIndex(h => h.includes('nombre'));
                const gapIdx = headers.findIndex(h => h.includes('gap'));
                const ticketIdx = headers.findIndex(h => h.includes('boleto'));

                if (nameIdx === -1 || ticketIdx === -1) {
                   console.warn("Could not find required columns (Nombre, Boleto) in CSV");
                }

                const parsedParticipants = rows.slice(1)
                    .map(row => {
                         // Safety check for row length
                        if (row.length < 2) return null;

                        const ticketVal = row[ticketIdx > -1 ? ticketIdx : 2]; // Fallback to col 2
                        const nameVal = row[nameIdx > -1 ? nameIdx : 0]; // Fallback to col 0
                        const gapVal = row[gapIdx > -1 ? gapIdx : 1]; // Fallback to col 1

                        const ticketNum = parseInt(ticketVal);
                        return {
                            name: nameVal,
                            gap: gapVal || '-',
                            ticket: isNaN(ticketNum) ? null : ticketNum
                        };
                    })
                    .filter(p => p && p.name && p.ticket !== null);

                setParticipants(parsedParticipants);
            } catch (err) {
                console.error("Error loading participants:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSheetData();
    }, [raffle.externalRegistrationLink]);

    const handleToggleTicket = (number) => {
        // Read-only if external (managed via sheet)
        if (raffle.externalRegistrationLink) return;

        setSelectedTickets(prev =>
            prev.includes(number)
                ? prev.filter(n => n !== number)
                : [...prev, number]
        );
    };

    const handleDownload = async () => {
        if (!captureRef.current) return;
        setIsGenerating(true);

        try {
            const element = captureRef.current;
            element.style.display = 'flex';

            const dataUrl = await toPng(element, {
                backgroundColor: '#0f172a',
                cacheBust: true,
                pixelRatio: 2,
                width: 1080,
                height: 1920,
                style: {
                    display: 'flex',
                    visibility: 'visible',
                }
            });

            element.style.display = 'none';

            const link = document.createElement('a');
            link.download = `rifa-${raffle.title.toLowerCase().replace(/\s+/g, '-')}-story.png`;
            link.href = dataUrl;
            link.click();

        } catch (err) {
            console.error('Error generating image:', err);
            alert('No se pudo generar la imagen. Intenta de nuevo.');
        } finally {
            if (captureRef.current) {
                captureRef.current.style.display = 'none';
            }
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: raffle.title,
            text: `¡Participa en la rifa de ${raffle.title}!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('¡Enlace copiado al portapapeles!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate occupied tickets
    const sheetOccupied = participants.map(p => p.ticket);
    const finalOccupiedTickets = raffle.externalRegistrationLink 
        ? sheetOccupied 
        : raffle.occupiedTickets;
    
    // Calculate total tickets (default 100 or override)
    const totalTickets = raffle.totalTickets || 100;
    const availableCount = totalTickets - finalOccupiedTickets.length;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Hidden Story Template (1080x1920) */}
            <div
                ref={captureRef}
                className="opacity fixed top-0 left-0 z-[-1] w-[1080px] h-[1920px] bg-slate-950 p-16 flex-col gap-12 hidden"
                style={{ background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)' }}
            >
                 <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-500/30">
                            <img src="/favicon.svg" alt="Logo" className="w-20 h-20 object-contain" crossOrigin="anonymous" />
                        </div>
                    </div>
                    <h1 className="text-6xl font-bold text-white leading-tight">{raffle.title}</h1>
                    <div className="flex justify-center gap-8 text-3xl text-indigo-300">
                        <span className="flex items-center gap-3">
                            <Calendar className="w-8 h-8" /> {formatDate(raffle.drawDate || raffle.endDate)}
                        </span>
                        <span className="flex items-center gap-3">
                            <Ticket className="w-8 h-8" /> {availableCount} Disponibles
                        </span>
                    </div>
                </div>

                <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-slate-800">
                    <img
                        src={raffle.image}
                        alt={raffle.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                    />
                </div>

                <div className="flex-1 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex flex-col">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center">Tabla de Boletos</h2>
                    <div className="flex-1">
                        <TicketGrid
                            occupiedTickets={finalOccupiedTickets}
                            selectedTickets={selectedTickets}
                            onToggleTicket={() => { }} 
                            totalTickets={totalTickets}
                            startNumber={raffle.startNumber ?? 1}
                            digits={raffle.digits ?? 2}
                        />
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-slate-800">
                    <p className="text-4xl font-bold text-indigo-400">¡Participa ahora!</p>
                    <p className="text-2xl text-slate-400 mt-4">Escanea o visita el enlace</p>
                </div>
            </div>

            {/* Visible Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column: Details & Image */}
                <div className="space-y-8">
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-6">
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
                            <img
                                src={raffle.image}
                                alt={raffle.title}
                                className="h-full w-full object-cover"
                                crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 shadow-black drop-shadow-lg">
                                    {raffle.title}
                                </h1>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-300 leading-relaxed">
                                {raffle.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-1">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Límite de Registro</span>
                                    </div>
                                    <p className="font-medium text-slate-200">{formatDate(raffle.endDate)}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-amber-400 mb-1">
                                        <Info className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Fecha de Sorteo</span>
                                    </div>
                                    <p className="font-medium text-slate-200">{formatDate(raffle.drawDate || raffle.endDate)}</p>
                                </div>
                            </div>

                            {selectedTickets.length > 0 && !raffle.externalRegistrationLink && (
                                <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                                    <span className="text-sm text-indigo-300 block mb-2">Boletos seleccionados:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTickets.sort((a, b) => a - b).map(num => (
                                            <span key={num} className="bg-indigo-500 text-white px-2 py-1 rounded text-sm font-bold shadow-lg shadow-indigo-500/20">
                                                #{num}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setShowGridModal(true)}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                        >
                            <Ticket className="h-5 w-5" />
                            Ver Disponibilidad de Boletos
                        </button>
                        
                        <div className="flex gap-4">
                            {raffle.externalRegistrationLink ? (
                                <div className="flex-1 bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl text-center">
                                    <p className="text-white font-bold">Para adquirir tu número:</p>
                                    <p className="text-indigo-300 text-sm mt-1">Contacta a David del GAP 023</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleDownload}
                                    disabled={isGenerating}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="h-5 w-5" />
                                    {isGenerating ? 'Generando...' : 'Descargar Ficha'}
                                </button>
                            )}
                            <button
                                onClick={handleShare}
                                className="bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600"
                            >
                                <Share2 className="h-5 w-5" />
                                Compartir
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                     {/* WINNER DISPLAY */}
                     {raffle.winningNumber !== null && participants.length > 0 && (
                        <div className="bg-amber-500/10 border-2 border-amber-500/50 p-6 rounded-3xl space-y-4 animate-in fade-in zoom-in duration-500">
                            <div className="flex items-center gap-3 text-amber-500">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Ticket className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">¡Tenemos Ganador!</h2>
                            </div>
                            
                                    {(() => {
                                        const fullNumber = raffle.winningNumber.toString().padStart(5, '0');
                                        const lastThree = parseInt(fullNumber.slice(-3));
                                        
                                        const result = findWinner(participants.map(p => p.ticket), lastThree);
                                        const winners = participants.filter(p => result.winners.includes(p.ticket));
                                        
                                        return (
                                            <>
                                                <div className="bg-slate-900/50 p-6 rounded-2xl border border-amber-500/20 text-center">
                                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-0 sm:divide-x divide-slate-800">
                                                        <div>
                                                            <p className="text-slate-400 text-xs mb-1 uppercase font-bold tracking-widest">Sorteo Nacional</p>
                                                            <div className="text-3xl font-bold text-slate-300 font-mono">
                                                                {fullNumber}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-amber-500 text-xs mb-1 uppercase font-bold tracking-widest">Boleto Ganador</p>
                                                            <div className="text-4xl font-black text-amber-500 font-mono">
                                                                # {lastThree.toString().padStart(3, '0')}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 pt-6 mt-4 border-t border-slate-800">
                                                        <div className="flex flex-wrap justify-center gap-4">
                                                            {winners.map((w, idx) => (
                                                                <div key={idx} className="bg-amber-500 text-slate-950 px-6 py-3 rounded-2xl font-black text-xl shadow-xl shadow-amber-500/20">
                                                                    {w.name} - GAP {w.gap}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p className="text-amber-500/80 text-sm font-medium">
                                                            {result.type === 'EXACT' 
                                                                ? '✨ ¡Coincidencia Exacta! ✨' 
                                                                : `✨ Ganador por proximidad (Diferencia: ${result.diff}) ✨`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                        </div>
                     )}

                     {/* RULES / ETC */}
                     {raffle.rules && (
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-6">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Info className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Reglas del Sorteo</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 px-6">
                                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Cronograma</h3>
                                    <ul className="text-slate-200 space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <strong>Cierre de Registro:</strong> {formatDate(raffle.endDate)}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                            <strong>Fecha del Sorteo:</strong> {formatDate(raffle.drawDate)}
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Dinámica</h3>
                                    <p className="text-slate-200 text-sm">{raffle.rules.description}</p>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Fuente de Resultados</h3>
                                    <p className="text-slate-200 text-sm">{raffle.rules.source}</p>
                                </div>

                                <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 border-l-4 border-l-indigo-500">
                                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Desempate (Número más cercano)</h3>
                                    <p className="text-slate-300 text-xs leading-relaxed">
                                        {raffle.rules.fallback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                
                    {/* Participant Table */}
                    {raffle.externalRegistrationLink && !loading && participants.length > 0 && (
                        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
                             <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Participantes</h3>
                                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
                                    {participants.length} Registrados
                                </span>
                             </div>
                             <div className="max-h-[500px] overflow-auto">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-slate-800/50 text-xs uppercase font-bold text-slate-300 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 whitespace-nowrap">Boleto</th>
                                            <th className="px-6 py-4 whitespace-nowrap">Nombre</th>
                                            <th className="px-6 py-4 whitespace-nowrap">GAP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {[...participants].sort((a,b) => a.ticket - b.ticket).map((p, i) => (
                                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono text-indigo-400 font-bold">#{p.ticket.toString().padStart(raffle.digits || 3, '0')}</td>
                                                <td className="px-6 py-4 text-white whitespace-nowrap">{p.name}</td>
                                                <td className="px-6 py-4">{p.gap}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Grid Modal */}
            {showGridModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 lg:p-8">
                    <div 
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setShowGridModal(false)}
                    />
                    <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Disponibilidad de Boletos</h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    {availableCount} de {totalTickets} boletos disponibles
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowGridModal(false)}
                                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="flex flex-wrap gap-4 text-sm mb-6 bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50 italic">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700"></div>
                                    <span className="text-slate-400">Ocupado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-indigo-500/20 border border-indigo-400/30"></div>
                                    <span className="text-slate-400">Disponible</span>
                                </div>
                                <div className="ml-auto text-slate-500 text-xs">
                                    * Esta tabla es informativa. El registro es manual.
                                </div>
                            </div>

                            <TicketGrid
                                occupiedTickets={finalOccupiedTickets}
                                selectedTickets={selectedTickets}
                                onToggleTicket={handleToggleTicket}
                                totalTickets={totalTickets}
                                startNumber={raffle.startNumber ?? 1}
                                digits={raffle.digits ?? 2}
                            />
                        </div>

                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                            <button 
                                onClick={() => setShowGridModal(false)}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
