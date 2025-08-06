import { atom } from "jotai";
import { roomStore } from "./store";
import type { User } from "./room";

export const selfAtom = atom<User | null>(null);

export function setSelf(user: User) {
    roomStore.set(selfAtom, () => ({ ...user }));
}
