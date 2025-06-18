import { useState, useRef, useEffect, useCallback } from "react";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

type Message = {
    fromMe: boolean;
    text: string;
    sender?: string;
};
interface ChatBoxProps {
    receiver: string;
    sendMessage: (destination: string, body: any) => void;
    isConnected: boolean;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<{ [receiver: string]: Message[] }>>;
    user: any;
}
const ChatBox = ({ receiver, sendMessage, isConnected, messages, setMessages, user }: ChatBoxProps) => {
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        sendMessage("/app/chat", {
            sender: user?.email || "Unknown",
            receiver: receiver,
            content: trimmed,
        });

        setMessages(prev => {
            const list = prev[receiver] || [];
            return { ...prev, [receiver]: [...list, { fromMe: true, text: trimmed }] };
        });
        setInput("");
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((msg, i) =>
                    msg.fromMe ? (
                        <MyMessage key={i} message={msg.text} />
                    ) : (
                        <OtherMessage
                            key={i}
                            message={msg.text}
                            name={msg.sender || "Unknown"}
                        />
                    )
                )}
                <div ref={bottomRef} />
            </div>

            <div className="h-16 flex items-center px-4 border-t border-gray-300 bg-white/70 backdrop-blur-md">
                <div className="relative flex w-full items-center gap-2">
                    <input
                        type="text"
                        placeholder="Write a message..."
                        className="flex-1 p-2 px-4 border rounded-full outline-none bg-gray-100"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2  px-4 py-1.5 text-sm rounded-full "
                    >
                        <PaperAirplaneIcon className="w-[25px] ml-auto cursor-pointer text-blue-500 hover:text-blue-600 transition" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatBox;
