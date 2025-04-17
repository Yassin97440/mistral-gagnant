import { Ollama } from "@langchain/ollama";

interface OllamaConfig {
    baseUrl: string;
    model: string;
    temperature: number;
}

export class OllamaClient {
    private static instance: Ollama;
    private config: OllamaConfig;

    private constructor(config: OllamaConfig = {
        baseUrl: "http://192.168.1.98:11434",
        model: "cogito:3b",
        temperature: 0
    }) {
        this.config = config;
    }

    public static getInstance(config?: OllamaConfig): Ollama {
        if (!OllamaClient.instance || config) {
            OllamaClient.instance = new Ollama(config);
        }
        return OllamaClient.instance;
    }

    public updateConfig(config: Partial<OllamaConfig>): void {
        this.config = { ...this.config, ...config };
        OllamaClient.instance = new Ollama({
            ...this.config
        });
    }




}
