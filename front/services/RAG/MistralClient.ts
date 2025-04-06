import type { MessageContent } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";

const { mistralApiKey } = useRuntimeConfig()
interface MistralConfig {
    model: string;
    temperature: number;
    apiKey?: string;
}

class MistralClient {

    public client: ChatMistralAI;
    private config: MistralConfig;

    constructor(config: MistralConfig = {
        model: "mistral-large-latest",
        temperature: 0.4,
        apiKey: mistralApiKey
    }) {
        this.config = config;
        this.client = new ChatMistralAI({
            ...this.config
        });
    }

    public async chat(message: string): Promise<MessageContent> {
        // try {
        const response = await this.client.invoke(message);
        return response.content;
        // } catch (error) {
        //     throw new Error(`Erreur lors de la communication avec Mistral: ${error}`);
        // }
    }
}

export default MistralClient;