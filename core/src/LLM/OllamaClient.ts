import { Ollama } from "@langchain/ollama";

interface OllamaConfig {
    model: string;
    temperature: number;
}

export class OllamaClient {
    private static instance: Ollama;
    private config: OllamaConfig;

    private constructor(config: OllamaConfig = {
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
