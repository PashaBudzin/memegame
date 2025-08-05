import { z } from "zod";
import { config } from "@/config";

const messageSchema = z.object({
    type: z.string().nonempty(),
    data: z.any().nullish(),
});

export class WebsocketService {
    private ws: WebSocket;

    private constructor(wsUrl: string) {
        this.ws = new WebSocket(wsUrl);
    }

    static async create(): Promise<WebsocketService> {
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

    async waitForResult(type: string, timeout = 5000): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => reject("request timed out"), timeout);

            const removeErrorListener = this.handleOperationType(
                `error-${type}`,
                (data: unknown) => {
                    console.error(`Recieved error for type ${type}`, data);
                    removeErrorListener();
                    reject(data);
                },
            );

            const removeOkListener = this.handleOperationType(
                `ok-${type}`,
                (_) => {
                    removeOkListener();
                    resolve();
                },
            );
        });
    }

    async attachUser(name: string) {
        this.sendMessage("attach-user", { name });

        await this.waitForResult("create-user");
    }
}
