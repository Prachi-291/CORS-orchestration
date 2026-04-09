import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5002';

const socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    withCredentials: true
});

export default socket;
