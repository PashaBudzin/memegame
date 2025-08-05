import { createFileRoute, redirect } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { WebsocketService } from "@/lib/websocket-service";
import Avatar from "@/components/avatar";
import { useWebsocketService } from "@/stores/websockets";

export const Route = createFileRoute("/me")({
    loader: async () => {
        const wss = await WebsocketService.create();
        const me = await wss.me();

        if (!me) {
            return redirect({ to: "/" });
        }

        return me;
    },
    component: Me,
});

function Me() {
    const meData: NonNullable<Awaited<ReturnType<WebsocketService["me"]>>> =
        Route.useLoaderData();

    const wss = useWebsocketService();

    async function createRoom() {
        try {
            const roomId = await wss.createRoom();

            console.log(`created room with id: ${roomId}`);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="glass absolute inset-0 m-20 mx-5 flex justify-center p-10 lg:mx-40">
            <div className="my-auto w-full lg:w-1/2">
                <div className="glass flex gap-5 p-2">
                    <div className="glass h-40 w-40 p-4">
                        <Avatar seed={meData.name} />
                    </div>
                    <p className="glass my-auto px-8 py-2 text-4xl font-semibold">
                        {meData.name}
                    </p>
                </div>

                <div className="mt-10">
                    <button
                        className="glass glass-btn flex gap-2 px-10 py-2 text-xl font-semibold"
                        onClick={async () => await createRoom()}
                    >
                        <span>
                            <Play />
                        </span>
                        Create room
                    </button>
                </div>
            </div>
        </div>
    );
}
