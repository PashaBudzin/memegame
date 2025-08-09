import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import TimeLeftIndicator from "../time-left-indicator";
import { roundAtom } from "@/stores/game";

export default function TextEditor() {
    const [roundState] = useAtom(roundAtom);

    if (!roundState)
        throw new Error(
            "this component is not supposed to be renderd if there is no round",
        );
    const [secondsLeft, setSecondsLeft] = useState(roundState.lengthSeconds);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 0.5 : 0));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => console.log(secondsLeft), [secondsLeft]);

    return (
        <div className="glass absolute inset-0 m-20 mx-5 flex justify-center p-10 lg:mx-40">
            <div className="my-auto w-full lg:w-1/3">
                <div>
                    <h1 className="text-center text-2xl font-bold">
                        Write your submission
                    </h1>
                    <input className="glass glass-input mt-5 w-full p-2" />
                    <br />
                    <button className="glass glass-btn mt-5 w-full p-2">
                        Submit
                    </button>
                    <TimeLeftIndicator
                        timeLeft={secondsLeft}
                        totalTime={roundState.lengthSeconds}
                    />
                </div>
            </div>
        </div>
    );
}
