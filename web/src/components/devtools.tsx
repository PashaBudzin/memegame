import { useAtomDevtools, useAtomsDebugValue } from "jotai-devtools";
import { roomAtom } from "@/stores/room";
import { selfAtom } from "@/stores/user";
import { gameStateAtom, roundAtom } from "@/stores/game";

export default function Devtools() {
    if (import.meta.env.PROD) return <></>;

    useAtomsDebugValue();

    useAtomDevtools(roomAtom, { name: "Rooms" });
    useAtomDevtools(selfAtom, { name: "Self" });
    useAtomDevtools(roundAtom, { name: "Round" });
    useAtomDevtools(gameStateAtom, { name: "Game State" });

    return null;
}
