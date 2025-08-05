import { atom } from "jotai";

export type User = {
    id: string;
    name: string;
};

export type ChatMessage = {
    from: string;
    content: string;
};

export type Room = {
    id: string;
    ownerId: string;
    users: Array<User>;
    chat: Array<ChatMessage>;
};

export const roomAtom = atom<Room | null>(null);
