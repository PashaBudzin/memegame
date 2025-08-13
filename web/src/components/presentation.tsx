import { useAtom } from "jotai/react";
import type { Submission } from "@/stores/game";
import { submissionPresentationAtom } from "@/stores/game";
import { roomAtom } from "@/stores/room";

export default function Presentation() {
    const [submissions] = useAtom(submissionPresentationAtom);

    return (
        <div className="glass absolute inset-0 m-20 mx-5 flex justify-center p-10 lg:mx-40">
            <div className="my-auto w-full lg:w-1/3">
                <h1>Presentation</h1>
                <div>
                    {Object.keys(submissions).map((k) =>
                        presentSubmission(submissions[k]),
                    )}
                </div>
            </div>
        </div>
    );
}

function presentSubmission(submission: Submission) {
    switch (submission.type) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        case "text":
            return <TextSubission submissionData={submission.data} />;
        default:
            throw new Error(
                `this type of submission isn't supported ${submission.type}`,
            );
    }
}

function TextSubission({
    submissionData,
}: {
    submissionData: Extract<Submission, { type: "text" }>["data"];
}) {
    const [room] = useAtom(roomAtom);

    return (
        <div className="w-full">
            <p>{submissionData}</p>
        </div>
    );
}
