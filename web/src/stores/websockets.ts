import { WebsocketService } from "@/lib/websocket-service";
import { atom, useAtom } from "jotai";

export const websocketAtom = atom(async () => await WebsocketService.create());

export const useWebsocketService = () => {
    const [wss] = useAtom(websocketAtom)

    return wss;
};
