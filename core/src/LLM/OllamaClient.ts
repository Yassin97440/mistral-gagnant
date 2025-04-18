import { ChatOllama } from "@langchain/ollama";

interface OllamaConfig {
    model: string;
    temperature: number;
}

export class OllamaClient {
    private static instance: ChatOllama;
    private config: OllamaConfig;

    private constructor(config: OllamaConfig = {
        model: "mistral",
        temperature: 0
    }) {
        this.config = config;
    }

    public static getInstance(config?: OllamaConfig): ChatOllama {
        if (!OllamaClient.instance || config) {
            OllamaClient.instance = new ChatOllama(config);
        }
        return OllamaClient.instance;
    }

    public updateConfig(config: Partial<OllamaConfig>): void {
        this.config = { ...this.config, ...config };
        OllamaClient.instance = new ChatOllama({
            ...this.config
        });
    }




}
