import { useAtom } from "jotai/react";
import Avatar from "./avatar";
import type { Submission } from "@/stores/game";
import { submissionPresentationAtom } from "@/stores/game";
import { roomAtom } from "@/stores/room";

export default function Presentation() {
    const [submissions] = useAtom(submissionPresentationAtom);

    return (
        <div className="glass absolute inset-0 m-20 mx-5 flex flex-col justify-center p-10 lg:mx-40">
            <h1 className="text-center">It's time to present!</h1>
            <div className="mx-auto h-full w-full overflow-x-auto lg:w-1/2">
                <div>
                    {Object.keys(submissions).map((k, i) =>
                        presentSubmission(submissions[k], k, i),
                    )}
                </div>
            </div>
        </div>
    );
}

function presentSubmission(submission: Submission, from: string, key: number) {
    switch (submission.type) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        case "text":
            return (
                <TextSubission
                    submissionData={submission.data}
                    key={key}
                    from={from}
                />
            );
        default:
            throw new Error(
                `this type of submission isn't supported ${submission.type}`,
            );
    }
}

function TextSubission({
    from,
    submissionData,
    key,
}: {
    from: string;
    submissionData: Extract<Submission, { type: "text" }>["data"];
    key: number;
}) {
    const [room] = useAtom(roomAtom);
    const fromUser = room?.users.find((u) => u.id == from);

    if (!fromUser) return <></>;

    return (
        <div className="glass mt-5 flex w-full p-4" key={key}>
            <div className="h-20 w-20">
                <Avatar seed={fromUser.name} />
            </div>
            <p className="my-auto text-center">{submissionData}</p>
        </div>
    );
}
