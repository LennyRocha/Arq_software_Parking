// server.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require("axios");
const getAxiosMessage = require("./utils/errorMessage");

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api';
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const notifyCorseOptions = {
    origin: BACKEND_URL,
    methods: ['POST'],
    credentials: true,
    allowedHeaders: ['Content-Type']
};

app.post('/notify', cors(notifyCorseOptions), (req, res) => {
    const { datos } = req.body;
    console.log('Notificación recibida de Spring');
    io.emit('sync', datos);
    res.json({ success: true });
});

app.post('/marcarje', cors(notifyCorseOptions), (req, res) => {
    const { accion, id } = req.body;
    const data = {
        accion: accion,
        id: id
    }
    console.log('Notificación recibida de Spring');
    io.emit('uuid', data);
    res.json({ success: true });
});

const activeSessions = new Map();

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    activeSessions.set(socket.id, socket);

    socket.on('get', async (data) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/cajones/all`, {
                params: {
                    piso: data.piso,
                    id: data.id
                }
            });
            socket.emit('response', response.data);
        } catch (error) {
            const details = getAxiosMessage(error)
            console.error(details)
            socket.emit('error', { mensaje: details });
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        activeSessions.delete(socket.id);
    });
});

io.on("error", (error) => {
    console.error(error);
})

server.listen(PORT, () => {
    console.log(`Servidor WebSocket en puerto ${PORT}`);
});