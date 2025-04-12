import type { MessageContent } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";

import { MISTRAL_API_KEY } from "varEnv"; 


interface MistralConfig {
    model: string;
    temperature: number;
    apiKey?: string;
}

export class MistralClient {

    public client: ChatMistralAI;
    private config: MistralConfig;

    constructor(config: MistralConfig = {
        model: "mistral-large-latest",
        temperature: 0,
        apiKey: MISTRAL_API_KEY
    }) {
        this.config = config;
        this.client = new ChatMistralAI({
            ...this.config
        });
    }

    public async chat(message: string): Promise<MessageContent> {
        const response = await this.client.invoke(message);

        return response.content;

    }
}

