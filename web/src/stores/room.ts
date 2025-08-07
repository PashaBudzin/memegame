import { atom } from "jotai";
import z from "zod";

export const userSchema = z.object({
    id: z.uuid().nonempty(),
    name: z.string().nonempty(),
    inactive: z.boolean().default(false),
});

export type User = z.infer<typeof userSchema>;

export const chatMessageSchema = z.object({
    from: z.uuid().nonempty(),
    message: z.string().nonempty(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const roomSchema = z.object({
    id: z.uuid().nonempty(),
    ownerId: z.uuid().nonempty(),
    users: z.array(userSchema),
    chat: z.array(chatMessageSchema),
});

export type Room = z.infer<typeof roomSchema>;

export const roomAtom = atom<Room | null>(null);
