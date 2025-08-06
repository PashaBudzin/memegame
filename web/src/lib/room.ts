import type { User } from "@/stores/room";
import { roomAtom } from "@/stores/room";
import { roomStore } from "@/stores/store";

export function addUser(user: User) {
    roomStore.set(roomAtom, (newRoom) => {
        if (!newRoom) {
            return newRoom;
        }

        return { ...newRoom, users: [...newRoom.users, user] };
    });
}

export function setUsers(users: Array<User>) {
    roomStore.set(roomAtom, (newRoom) => {
        if (!newRoom) return newRoom;

        return { ...newRoom, users };
    });
}

export function removeUser(userId: string, newOwnerId: string) {
    roomStore.set(roomAtom, (newRoom) => {
        if (!newRoom) return newRoom;

        const users = newRoom.users.filter((user: User) => user.id !== userId);

        return { ...newRoom, users, ownerId: newOwnerId };
    });
}

export function addChatMessage(from: string, content: string) {
    roomStore.set(roomAtom, (newRoom) => {
        if (!newRoom) return null;

        return { ...newRoom, chat: [...newRoom.chat, { from, content }] };
    });
}

export function resetRoom() {
    roomStore.set(roomAtom, null);
}

export function setRoom(ownerId: string, roomId: string, users: Array<User>) {
    roomStore.set(roomAtom, (_) => {
        return {
            id: roomId,
            ownerId,
            users,
            chat: [],
        };
    });
}
