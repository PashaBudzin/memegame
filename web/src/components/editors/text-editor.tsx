import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import TimeLeftIndicator from "../time-left-indicator";
import type { Submission } from "@/stores/game";
import { roundAtom } from "@/stores/game";
import { useWebsocketService } from "@/stores/websockets";

export default function TextEditor() {
    const [roundState] = useAtom(roundAtom);
    const wss = useWebsocketService();

    if (!roundState)
        throw new Error(
            "this component is not supposed to be renderd if there is no round",
        );
    const [secondsLeft, setSecondsLeft] = useState(roundState.lengthSeconds);
    const [submission, setSubmission] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 0.5 : 0));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const sendSubmission = useCallback(async (submissionData: Submission) => {
        await wss.attachSubmission(submissionData);
    }, []);

    return (
        <div className="glass absolute inset-0 m-20 mx-5 flex justify-center p-10 lg:mx-40">
            <div className="my-auto w-full lg:w-1/3">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const input = (
                            e.target as HTMLFormElement
                        ).elements.namedItem("submission") as HTMLInputElement;

                        const submissionText = input.value;

                        await sendSubmission({
                            type: "text",
                            data: submissionText,
                        });
                    }}
                    autoComplete="off"
                >
                    b
                    <label
                        className="text-center text-2xl font-bold"
                        htmlFor="submission"
                    >
                        Write your submission
                    </label>
                    <input
                        className="glass glass-input mt-5 w-full p-2"
                        name="submission"
                        onChange={(e) => setSubmission(e.target.value)}
                    />
                    <br />
                    <button
                        className="glass glass-btn mt-5 w-full p-2"
                        disabled={!submission}
                    >
                        Submit
                    </button>
                    <TimeLeftIndicator
                        timeLeft={secondsLeft}
                        totalTime={roundState.lengthSeconds}
                    />
                </form>
            </div>
        </div>
    );
}
