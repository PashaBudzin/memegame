import { config } from "@/config";

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
        this.ws.addEventListener("message", (msg) => {
            let data: unknown;

            try {
                data = JSON.parse(msg.data);
            } catch (err) {
                console.error(err);
                return;
            }

            if (
                typeof data === "object" &&
                data != null &&
                "type" in data &&
                typeof data.type === "string" &&
                "data" in data &&
                data.type == type
            ) {
                callback(data.data);
                return;
            }
            console.error("data isn't of correct format", data);
        });
    }
}
