import { useAtomDevtools, useAtomsDebugValue } from "jotai-devtools";
import { roomAtom } from "@/stores/room";
import { selfAtom } from "@/stores/user";

export default function Devtools() {
    if (import.meta.env.PROD) return <></>;

    useAtomsDebugValue();

    useAtomDevtools(roomAtom, { name: "Rooms" });
    useAtomDevtools(selfAtom, { name: "Self" });

    return null;
}
