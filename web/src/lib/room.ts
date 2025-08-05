import type { User } from "@/stores/room";
import { roomAtom } from "@/stores/room";
import { roomStore } from "@/stores/store";

export function addUser(user: User) {
    const newRoom = roomStore.get(roomAtom);

    if (!newRoom) return;

    newRoom.users.push(user);

    roomStore.set(roomAtom, newRoom);
}

export function removeUser(userId: string, newOwnerId: string) {
    const newRoom = roomStore.get(roomAtom);

    if (!newRoom) return;

    newRoom.users = newRoom.users.filter((user: User) => user.id != userId);

    newRoom.ownerId = newOwnerId;

    roomStore.set(roomAtom, newRoom);
}

export function addChatMessage(from: string, content: string) {
    const newRoom = roomStore.get(roomAtom);

    if (!newRoom) return;

    newRoom.chat.push({ from, content });

    roomStore.set(roomAtom, newRoom);
}

export function resetRoom() {
    roomStore.set(roomAtom, null);
}

export function setRoom(ownerId: string, roomId: string, users: Array<User>) {
    const newRoom = {
        id: roomId,
        ownerId,
        users,
        chat: [],
    };

    roomStore.set(roomAtom, newRoom);
}
