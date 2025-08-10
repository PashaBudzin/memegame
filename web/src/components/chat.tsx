import { useAtom } from "jotai";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef } from "react";
import Avatar from "./avatar";
import { roomAtom } from "@/stores/room";
import { cn } from "@/lib/utils";
import { selfAtom } from "@/stores/user";
import { useWebsocketService } from "@/stores/websockets";

export default function Chat() {
    const [room] = useAtom(roomAtom);
    const [me] = useAtom(selfAtom);

    const ref = useRef<HTMLDivElement>(null);
    const wss = useWebsocketService();

    useEffect(() => {
        if (ref.current == null) return;

        ref.current.scrollIntoView({ behavior: "smooth" });
    }, [room?.chat.length]);

    const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        const input = form.elements.namedItem(
            "message",
        ) as HTMLInputElement | null;

        if (!input) return;

        const message = input.value.trim();

        wss.sendChatMessage(message);

        form.reset();
    };

    return (
        <div className="glass mt-4 flex h-full flex-col p-5">
            <div className="flex h-1 flex-grow flex-col gap-2 overflow-y-scroll px-1 py-2">
                {room?.chat.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "glass glass-accent p-2",
                            me?.id == msg.from ? "ml-4" : "mr-4",
                        )}
                    >
                        <div className="flex">
                            <div className="h-10 w-10">
                                <Avatar
                                    seed={
                                        room.users.find((u) => u.id == msg.from)
                                            ?.name ?? ""
                                    }
                                />
                            </div>
                            <p className="my-auto text-lg font-semibold">
                                {room.users.find((u) => u.id == msg.from)
                                    ?.name ?? ""}
                            </p>
                        </div>
                        <p className="mb-2">{msg.message}</p>
                    </div>
                ))}
                <div ref={ref}></div>
            </div>
            <div className="mt-auto flex-none">
                <form
                    className="glass flex min-h-8"
                    onSubmit={sendMessage}
                    autoComplete="off"
                >
                    <input
                        name="message"
                        className="glass-input w-5/6 rounded-l-[32px] p-1 px-2"
                        placeholder="Your message"
                    />
                    <button className="glass-btn border-only-right h-full w-1/6 rounded-r-[32px] border-l-0 p-1">
                        <SendHorizonal className="mx-auto my-auto" />
                    </button>
                </form>
            </div>
        </div>
    );
}
