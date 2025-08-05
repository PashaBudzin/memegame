import { createFileRoute, redirect } from "@tanstack/react-router";
import { WebsocketService } from "@/lib/websocket-service";
import Avatar from "@/components/avatar";

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

    return (
        <div className="glass absolute inset-0 m-20 mx-5 flex justify-center p-10 lg:mx-40">
            <div className="my-auto flex w-full gap-5 lg:w-1/2">
                <div className="glass h-40 w-40 p-4">
                    <Avatar seed={meData.name} />
                </div>
                <p className="glass my-auto px-8 py-2 text-4xl font-semibold">
                    {meData.name}
                </p>
            </div>
        </div>
    );
}
