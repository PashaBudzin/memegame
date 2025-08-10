import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Crown } from "lucide-react";
import Chat from "@/components/chat";
import { roomAtom } from "@/stores/room";
import Avatar from "@/components/avatar";
import { roomStore } from "@/stores/store";
import GamemodeSelector from "@/components/gamemode-selector";
import { gameStateAtom } from "@/stores/game";
import Game from "@/components/game";

export const Route = createFileRoute("/room/$roomId")({
    loader: (p) => {
        const room = roomStore.get(roomAtom);

        if (p.params.roomId != p.params.roomId) {
            return redirect({
                to: "/me",
            });
        }

        if (!room) {
            return redirect({
                to: "/",
                search: {
                    roomId: p.params.roomId,
                },
            });
        }
    },
    component: Room,
});

function Room() {
    const [room] = useAtom(roomAtom);
    const [gameState] = useAtom(gameStateAtom);

    if (gameState == "started") return <Game />;

    return (
        <div className="glass absolute inset-0 m-20 mx-5 grid grid-cols-8 justify-center lg:mx-40">
            <div className="glassy-border col-span-2 flex flex-col gap-2 border-r border-white/30 px-2 pt-5">
                <p className="text-center text-xl">Players</p>
                {room?.users.map((user) => (
                    <div className="glass flex w-full gap-2 p-2" key={user.id}>
                        <div className="h-full w-10">
                            <Avatar seed={user.name} />
                        </div>
                        <p className="my-auto text-lg">{user.name}</p>
                        {user.id == room.ownerId ? (
                            <Crown className="mr-4 ml-auto h-full fill-yellow-500 stroke-yellow-500" />
                        ) : (
                            <></>
                        )}
                    </div>
                ))}
            </div>
            <div className="col-span-4 flex flex-col">
                <p className="font-xl p-2 pt-5 text-center text-xl">
                    Select round type
                </p>

                <GamemodeSelector />
            </div>

            <div className="glassy-border col-span-2 flex flex-col border-l border-white/30 px-2 pt-5 pb-2">
                <p className="text-center text-xl">Chat</p>
                <Chat />
            </div>
        </div>
    );
}
