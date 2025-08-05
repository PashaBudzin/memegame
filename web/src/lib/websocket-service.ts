import { z } from "zod";
import { config } from "@/config";
import { setRoom } from "@/lib/room";

const messageSchema = z.object({
    type: z.string().nonempty(),
    data: z.any().nullish(),
});

export class WebsocketService {
    private ws: WebSocket;
    private static instance: WebsocketService | null = null;

    private constructor(wsUrl: string) {
        this.ws = new WebSocket(wsUrl);
    }

    static async create(): Promise<WebsocketService> {
        if (this.instance) return this.instance;

        const service = new WebsocketService(config.wsUrl);
        await new Promise<void>((resolve, reject) => {
            service.ws.addEventListener("open", () => {
                resolve();
            });

            service.ws.addEventListener("error", (err) => {
                console.error("failed to create WebsocketService ", err);
                reject(err);
            });
        });

        this.instance = service;

        return service;
    }

    sendMessage(type: string, data: Record<string, any> | null) {
        this.ws.send(JSON.stringify({ type, data }));
    }

    handleOperationType(type: string, callback: (data: unknown) => void) {
        const listener = (msg: Record<any, any>) => {
            let jsonData: unknown;

            try {
                jsonData = JSON.parse(msg.data);
            } catch (err) {
                console.error(err);
                return;
            }

            const parsed = messageSchema.safeParse(jsonData);

            if (!parsed.success) {
                console.error("data isn't of correct format", parsed);
            }

            if (type != parsed.data?.type) return;

            callback(parsed.data.data);
        };

        this.ws.addEventListener("message", listener);

        return () => {
            this.ws.removeEventListener("message", listener);
        };
    }

    async waitForResult(type: string, timeoutMs = 5000) {
        return new Promise<unknown>((resolve, reject) => {
            setTimeout(() => reject("request timed out"), timeoutMs);

            const removeErrorListener = this.handleOperationType(
                `error-${type}`,
                (data: unknown) => {
                    console.error(`Recieved error for type ${type}`, data);
                    removeErrorListener();
                    removeOkListener();
                    reject(data);
                },
            );

            const removeOkListener = this.handleOperationType(
                `ok-${type}`,
                (data: unknown) => {
                    removeOkListener();
                    removeErrorListener();
                    resolve(data);
                },
            );
        });
    }

    async attachUser(name: string) {
        this.sendMessage("attach-user", { name });

        await this.waitForResult("create-user");
    }

    async createRoom() {
        this.sendMessage("create-room", null);

        const result = await this.waitForResult("create-room");

        const resultSchema = z.string().nullable();

        return resultSchema.parse(result);
    }

    async me() {
        this.sendMessage("me", null);

        const result = await this.waitForResult("me");

        const resultSchema = z
            .object({
                id: z.string(),
                name: z.string(),
                roomId: z.string().nullable(),
            })
            .nullable();

        return resultSchema.parse(result);
    }

    async joinRoom(roomId: string) {
        this.sendMessage("join-room", { roomId });

        const result = await this.waitForResult("join-room");

        console.log(result);

        const resultSchema = z.object({
            ownerId: z.string(),
            roomId: z.string(),
            users: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                }),
            ),
        });

        const parsedResult = resultSchema.parse(result);

        setRoom(parsedResult.ownerId, parsedResult.roomId, parsedResult.users);

        return result;
    }
}

declare global {
    interface Window {
        wss?: WebsocketService;
    }
}

if (import.meta.env.DEV) {
    window.wss = await WebsocketService.create();
}
