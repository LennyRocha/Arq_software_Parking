import React from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function useWebSocket(url, topic, onMessage) {
    const clientRef = React.useRef(null);

    React.useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(url),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP conectado');
                client.subscribe(topic, (msg) => {
                    const body = JSON.parse(msg.body);
                    onMessage && onMessage(body);
                });
            },
            onStompError: (frame) => {
                console.log('Error STOMP', frame);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [url, topic, onMessage]);

    return clientRef.current;
}