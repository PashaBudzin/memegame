import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import Chat from "@/components/chat";
import { roomAtom } from "@/stores/room";
import Avatar from "@/components/avatar";
// import { useWebsocketService } from "@/stores/websockets";

export const Route = createFileRoute("/room/$roomId")({
    component: Room,
});

function Room() {
    // const wss = useWebsocketService();
    //
    const [room] = useAtom(roomAtom);

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
                    </div>
                ))}
            </div>
            <div className="col-span-4">Col span 2</div>

            <div className="glassy-border col-span-2 flex flex-col border-l border-white/30 px-2 pt-5 pb-2">
                <p className="text-center text-xl">Chat</p>
                <Chat />
            </div>
        </div>
    );
}
