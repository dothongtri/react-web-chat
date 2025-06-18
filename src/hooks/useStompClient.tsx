import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

interface ReceiveMessage {
    content: string;
    sender?: string;
    receiver?: string;
}

interface SendMessage {
    sender: string;
    receiver: string;
    content: string;
}

type MessageHandler = (message: ReceiveMessage) => void;

export const useStompClient = (
    onMessage: MessageHandler,
    subscribeDestination: string = "/user/queue/messages"
) => {
    const stompClientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws-chat",
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                setIsConnected(true);

                client.subscribe(subscribeDestination, (msg) => {
                    const body = JSON.parse(msg.body);
                    onMessage(body);
                    console.log("Received message:", body);
                });
            },
            onStompError: (frame) => {
                console.error("STOMP Error:", frame.headers["message"]);
                console.error("Details:", frame.body);
            },
            reconnectDelay: 5000,
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
            setIsConnected(false);
        };
    }, [onMessage, subscribeDestination]);

    const sendMessage = (destination: string, body: SendMessage) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.warn("WebSocket is not connected.");
        }
    };

    return {
        sendMessage,
        isConnected,
    };
};
