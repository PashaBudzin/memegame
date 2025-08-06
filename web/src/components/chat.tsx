import { useAtom } from "jotai";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef } from "react";
import Avatar from "./avatar";
import { roomAtom } from "@/stores/room";
import { cn } from "@/lib/utils";
import { selfAtom } from "@/stores/user";

export default function Chat() {
    const [room] = useAtom(roomAtom);
    const [me] = useAtom(selfAtom);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current == null) return;

        ref.current.scrollIntoView({ behavior: "smooth" });
    }, [room?.chat.length]);

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
                        <p className="mb-2">{msg.content}</p>
                    </div>
                ))}
                <div ref={ref}></div>
            </div>
            <div className="mt-auto flex-none">
                <div className="glass flex min-h-8">
                    <input
                        className="glass-input w-5/6 rounded-l-[32px] p-1 px-2"
                        placeholder="Your message"
                    />
                    <button className="glass-btn border-only-right h-full w-1/6 rounded-r-[32px] border-l-0 p-1">
                        <SendHorizonal className="mx-auto my-auto" />
                    </button>
                </div>
            </div>
        </div>
    );
}
