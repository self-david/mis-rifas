import React, { useState, useRef } from 'react';
import { Calendar, Download, Share2, Ticket } from 'lucide-react';
import { toPng } from 'html-to-image';
import TicketGrid from './TicketGrid';

export default function RaffleView({ raffle }) {
    const [selectedTickets, setSelectedTickets] = useState([]);
    const captureRef = useRef(null); // Ref for the hidden story template
    const [isGenerating, setIsGenerating] = useState(false);

    const handleToggleTicket = (number) => {
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
            // Force the hidden container to be visible for capture
            const element = captureRef.current;
            element.style.display = 'flex';

            const dataUrl = await toPng(element, {
                backgroundColor: '#0f172a',
                cacheBust: true,
                pixelRatio: 2,
                width: 1080,
                height: 1920,
                style: {
                    display: 'flex', // Ensure it's flex in the clone
                    visibility: 'visible',
                }
            });

            // Hide it again
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
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const availableCount = 100 - raffle.occupiedTickets.length;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Hidden Story Template (1080x1920) */}
            <div
                ref={captureRef}
                className="opacity fixed top-0 left-0 z-[-1] w-[1080px] h-[1920px] bg-slate-950 p-16 flex-col gap-12 hidden"
                style={{ background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)' }}
            >
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-500/30">
                            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" crossOrigin="anonymous" />
                        </div>
                    </div>
                    <h1 className="text-6xl font-bold text-white leading-tight">{raffle.title}</h1>
                    <div className="flex justify-center gap-8 text-3xl text-indigo-300">
                        <span className="flex items-center gap-3">
                            <Calendar className="w-8 h-8" /> {formatDate(raffle.endDate)}
                        </span>
                        <span className="flex items-center gap-3">
                            <Ticket className="w-8 h-8" /> {availableCount} Disponibles
                        </span>
                    </div>
                </div>

                {/* Main Image */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-slate-800">
                    <img
                        src={raffle.image}
                        alt={raffle.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                    />
                </div>

                {/* Ticket Grid */}
                <div className="flex-1 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex flex-col">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center">Tabla de Boletos</h2>
                    <div className="flex-1">
                        <TicketGrid
                            occupiedTickets={raffle.occupiedTickets}
                            selectedTickets={selectedTickets}
                            onToggleTicket={() => { }} // Read-only in image
                        />
                    </div>
                </div>

                {/* Footer */}
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
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
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
                                        <span className="text-xs font-bold uppercase tracking-wider">Finaliza</span>
                                    </div>
                                    <p className="font-medium text-slate-200">{formatDate(raffle.endDate)}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                        <Ticket className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Disponibles</span>
                                    </div>
                                    <p className="font-medium text-slate-200">{availableCount} / 100</p>
                                </div>
                            </div>

                            {selectedTickets.length > 0 && (
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

                    <div className="flex gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="h-5 w-5" />
                            {isGenerating ? 'Generando...' : 'Descargar Ficha (Story)'}
                        </button>
                        <button
                            onClick={handleShare}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                        >
                            <Share2 className="h-5 w-5" />
                            Compartir
                        </button>
                    </div>
                </div>

                {/* Right Column: Ticket Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Elige tus boletos</h2>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></div>
                                <span className="text-slate-400">Ocupado</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-indigo-500"></div>
                                <span className="text-slate-400">Selección</span>
                            </div>
                        </div>
                    </div>

                    <TicketGrid
                        occupiedTickets={raffle.occupiedTickets}
                        selectedTickets={selectedTickets}
                        onToggleTicket={handleToggleTicket}
                    />
                </div>
            </div>
        </div>
    );
}
