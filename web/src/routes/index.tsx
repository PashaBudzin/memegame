import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import Avatar from "@/components/avatar";
import { useWebsocketService } from "@/stores/websockets";

const searchParamsSchema = z.object({
    roomId: z.uuid().optional(),
});

export const Route = createFileRoute("/")({
    validateSearch: (search) => searchParamsSchema.parse(search),
    component: App,
});

function App() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const search = Route.useSearch();

    const wss = useWebsocketService();

    const handleCreateRoom = async (userName: string) => {
        if (userName.length < 1) {
            return;
        }

        try {
            await wss.attachUser(userName);

            if (!search.roomId) return await navigate({ to: "/me" });

            const result = await wss.joinRoom(search.roomId);

            if (result) {
                await navigate({
                    to: "/room/$roomId",
                    params: { roomId: search.roomId },
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="glass absolute inset-0 m-20 mx-5 flex justify-center p-10 lg:mx-40">
            <div className="my-auto w-full lg:w-1/2">
                <div className="glass mx-auto h-40 w-40 border border-white/50 bg-white p-4">
                    <Avatar seed={name} />
                </div>
                <p className="mt-5 text-center text-xl font-semibold">
                    Select your name
                </p>
                <div className="flex w-full flex-col justify-center">
                    <input
                        name="lelik"
                        className="glass glass-input mx-auto mt-5 w-full p-1 px-2 lg:w-1/2"
                        placeholder="Your name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <button
                        className="glass glass-btn mx-auto mt-5 w-full p-1 px-2 lg:w-1/2"
                        disabled={!name}
                        onClick={() => handleCreateRoom(name)}
                    >
                        {search.roomId ? "Join room" : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}
