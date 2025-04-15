import type { MessageContent } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";



interface MistralConfig {
    model: string;
    temperature: number;
    apiKey?: string;
}

export class MistralClient {
    private static instance: MistralClient;
    public client: ChatMistralAI;
    private config: MistralConfig;

    private constructor(config: MistralConfig = {
        model: "mistral-large-latest",
        temperature: 0,
        apiKey: process.env.MISTRAL_API_KEY
    }) {
        this.config = config;
        this.client = new ChatMistralAI({
            ...this.config
        });
    }

    public static getInstance(config?: MistralConfig): MistralClient {
        if (!MistralClient.instance || config) {
            MistralClient.instance = new MistralClient(config);
        }
        return MistralClient.instance;
    }

    public updateConfig(config: Partial<MistralConfig>): void {
        this.config = { ...this.config, ...config };
        this.client = new ChatMistralAI({
            ...this.config
        });
    }

    public async chat(message: string): Promise<MessageContent> {
        const response = await this.client.invoke(message);

        return response.content;

    }
}

