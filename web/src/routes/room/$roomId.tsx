import Chat from "@/components/chat";
import { useWebsocketService } from "@/stores/websockets";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/room/$roomId")({
    component: Room,
});

function Room() {
    const wss = useWebsocketService();

    useEffect(() => {
        wss.handleOperationType("pong", _ => console.log("pong"))
        wss.sendMessage("ping", null);
    }, []);

    return (
        <div className="glass absolute inset-0 m-20 mx-5 grid grid-cols-8 justify-center lg:mx-40">
            <div className="glassy-border col-span-2 border-r border-white/30">
                Col span 2
            </div>
            <div className="col-span-4">Col span 2</div>

            <div className="glassy-border col-span-2 flex flex-col border-l border-white/30 px-2 pt-5 pb-2">
                <p className="text-center text-xl">Chat</p>
                <Chat />
            </div>
        </div>
    );
}
