import { atom, useAtom } from "jotai";
import { WebsocketService } from "@/lib/websocket-service";

export const websocketAtom = atom(async () => await WebsocketService.create());

export const useWebsocketService = () => {
    const [wss] = useAtom(websocketAtom)

    return wss;
};
