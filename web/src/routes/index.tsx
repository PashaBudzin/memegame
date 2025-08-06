import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import Avatar from "@/components/avatar";
import { useWebsocketService } from "@/stores/websockets";
import { selfAtom } from "@/stores/user";
import { roomStore } from "@/stores/store";
import { WebsocketService } from "@/lib/websocket-service";

const searchParamsSchema = z.object({
    roomId: z.uuid().optional(),
});

export const Route = createFileRoute("/")({
    validateSearch: (search) => searchParamsSchema.parse(search),
    loader: async ({ location }) => {
        const me = roomStore.get(selfAtom);

        const params = new URLSearchParams(location.search);
        const roomId = params.get("roomId");
        if (me == null) return;

        if (roomId) {
            try {
                const wss = await WebsocketService.create();

                wss.joinRoom(roomId);

                return redirect({
                    to: "/room/$roomId",
                    params: {
                        roomId,
                    },
                });
            } catch (err) {
                console.error("failed to join room");
            }
        }

        return redirect({
            to: "/me",
        });
    },
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
        } catch (err) {
            console.error(err);
            return;
        }

        await wss.me();

        try {
            const result = await wss.joinRoom(search.roomId);

            if (result) {
                return await navigate({
                    to: "/room/$roomId",
                    params: { roomId: search.roomId },
                });
            }
        } catch (err) {
            console.error(err);
            return await navigate({ to: "/me" });
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
                <form
                    className="flex w-full flex-col justify-center"
                    onSubmit={(e) => {
                        e.preventDefault();

                        const input = (
                            e.target as HTMLFormElement
                        ).elements.namedItem("name") as HTMLInputElement | null;

                        if (!input) return;

                        handleCreateRoom(name);
                    }}
                    autoComplete="off"
                >
                    <input
                        name="name"
                        className="glass glass-input mx-auto mt-5 w-full p-1 px-2 lg:w-1/2"
                        placeholder="Your name"
                        maxLength={20}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <button
                        type="submit"
                        className="glass glass-btn mx-auto mt-5 w-full p-1 px-2 lg:w-1/2"
                        disabled={!name}
                    >
                        {search.roomId ? "Join room" : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
