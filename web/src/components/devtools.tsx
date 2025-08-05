import { useAtomDevtools, useAtomsDebugValue } from "jotai-devtools";
import { roomAtom } from "@/stores/room";

export default function Devtools() {
    if (import.meta.env.PROD) return <></>;

    useAtomDevtools(roomAtom, { name: "Rooms" });
    useAtomsDebugValue();

    return <></>;
}
