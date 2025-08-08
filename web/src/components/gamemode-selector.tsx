import { useState } from "react";
import { Brush, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const gameTypes = [
    {
        type: "classic",
        name: "Classic",
        icon: <Brush className="h-full w-full stroke-yellow-500" />,
    },
    {
        type: "classic",
        name: "Classic",
        icon: <Brush className="h-full w-full stroke-yellow-500" />,
    },
    {
        type: "classic",
        name: "Classic",
        icon: <Brush className="h-full w-full stroke-yellow-500" />,
    },

    {
        type: "classic",
        name: "Classic",
        icon: <Brush className="h-full w-full stroke-yellow-500" />,
    },
    {
        type: "classic",
        name: "Classic",
        icon: <Brush className="h-full w-full stroke-yellow-500" />,
    },
    {
        type: "classic",
        name: "Classic",
        icon: <Brush className="h-full w-full stroke-yellow-500" />,
    },
];

export default function GamemodeSelector() {
    const [selectedRound, setSelectedRound] = useState(0);

    return (
        <>
            <div className="mt-10 grid w-full grid-cols-3 gap-1 px-5">
                {gameTypes.map((gt, i) => (
                    <div className={cn("h-44 rounded-3xl p-1")}>
                        <button
                            className={cn(
                                selectedRound == i && "scale-110 text-xl",
                                "glass glass-btn h-full w-full",
                            )}
                            onClick={() => setSelectedRound(i)}
                        >
                            <div className="mx-auto h-20 w-20">{gt.icon}</div>
                            <p>{gt.name}</p>
                        </button>
                    </div>
                ))}
            </div>
            <button className="glass glass-btn mx-auto mt-auto mb-5 flex gap-2 p-4 px-8">
                <Play />
                <p>Start Game</p>
            </button>
        </>
    );
}
