import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Bell, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Extraemos la base (sin /api) para la conexión del socket
const SOCKET_URL = API_BASE_URL.replace('/api', '');

const NotificationToast = ({ onNewQuote }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Solicitar permiso para notificaciones de sistema (OS)
        if ("Notification" in window) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }

        // Conectar al WebSocket
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Conectado al servidor de notificaciones (Socket.io)');
        });

        // Escuchar el evento de nueva cotización
        socket.on('new-quote', (quoteData) => {
            console.log('Nueva cotización recibida en tiempo real:', quoteData);

            const companyName = quoteData.company || quoteData.contact;

            // 1. Notificación de sistema (OS) - Estilo WhatsApp/Windows
            if ("Notification" in window && Notification.permission === "granted") {
                try {
                    const osNotification = new Notification("Nueva Cotización Volper Seal", {
                        body: `📋 Solicitud de: ${companyName}\n🕒 Recibida: ${new Date().toLocaleTimeString()}\n\nHaga clic para abrir el panel.`,
                        tag: 'new-quote-notification',
                        silent: false,
                        requireInteraction: false, // Se cierra sola según el SO
                    });

                    osNotification.onclick = (e) => {
                        e.preventDefault();
                        window.focus();
                        removeNotification(newNotif.id);
                    };
                } catch (err) {
                    console.error("Error al mostrar notificación de sistema:", err);
                }
            }

            // 2. Notificación visual en la UI (Toast)
            const newNotif = {
                id: Date.now(),
                company: companyName,
                time: new Date().toLocaleTimeString(),
            };

            setNotifications(prev => [...prev, newNotif]);

            // Ejecutar callback para actualizar datos en el Dashboard padre si es necesario
            if (onNewQuote) {
                onNewQuote(quoteData);
            }

            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                removeNotification(newNotif.id);
            }, 5000);
        });

        return () => {
            socket.disconnect();
        };
    }, [onNewQuote]);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map(notif => (
                <div
                    key={notif.id}
                    className="bg-white border-l-4 border-blue-500 shadow-xl rounded-md p-4 flex items-start gap-4 animate-slide-up max-w-sm"
                >
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                        <Bell size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">¡Nueva Solicitud de Cotización!</h4>
                        <p className="text-gray-600 text-xs mt-1">
                            De: <span className="font-semibold">{notif.company}</span>
                        </p>
                        <span className="text-gray-400 text-xs text-[10px] mt-2 block">
                            Recibida a las {notif.time}
                        </span>
                    </div>
                    <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;
