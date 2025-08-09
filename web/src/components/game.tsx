import { useAtom } from "jotai";
import TextEditor from "./editors/text-editor";
import type { RoundType } from "@/stores/game";
import { roundAtom } from "@/stores/game";

function submissionEditor(type: RoundType) {
    switch (type) {
        case "text":
            return <TextEditor />;
        case "draw":
            return <></>;
    }
}

export default function Game() {
    const [roundState] = useAtom(roundAtom);

    if (!roundState) return <>TODO! ADD waiting lobby</>;

    const editor = submissionEditor(roundState.type);

    return editor;
}
