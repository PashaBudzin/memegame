import { atom } from "jotai";
import z from "zod";

export const roundTypeSchema = z.enum(["text", "draw"]);

export type RoundType = z.infer<typeof roundTypeSchema>;

export const roundSchema = z.object({
    type: roundTypeSchema,
    lengthSeconds: z.number().nonnegative(),
});

export type Round = z.infer<typeof roundSchema>;

export type GameState = {
    started: boolean;
    startingIn: boolean;
};

export const roundAtom = atom<Round | null>(null);
export const gameStateAtom = atom<GameState | null>(null);
