import { atom } from "jotai";
import z from "zod";

export const roundTypeSchema = z.enum(["text", "draw"]);

export type RoundType = z.infer<typeof roundTypeSchema>;

export const roundSchema = z.object({
    type: roundTypeSchema,
    lengthSeconds: z.number().nonnegative(),
});

export const submissionSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("text"),
        data: z.string(),
    }),
]);

export const submissionsRecordSchema = z.record(z.string(), submissionSchema);

export type Submission = z.infer<typeof submissionSchema>;

export type Round = z.infer<typeof roundSchema>;

export type SubmissionsRecord = z.infer<typeof submissionsRecordSchema>;

export type GameState = "starting" | "started" | "presentation" | "no-game";

export const roundAtom = atom<Round | null>(null);
export const gameStateAtom = atom<GameState>("no-game");
export const submissionPresentationAtom = atom<SubmissionsRecord>({});
