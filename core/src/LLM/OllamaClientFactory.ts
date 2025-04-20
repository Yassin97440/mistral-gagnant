import { ChatOllama } from "@langchain/ollama";
import { OllamaClient } from "./OllamaClient";

export class OllamaClientFactory {
    private static instances: Record<string, ChatOllama> = {};

    /**
     * Retourne une instance de ChatOllama selon le modèle et la température
     * @param model Nom du modèle à utiliser
     * @param temperature Température pour la génération (défaut: 0.1)
     * @returns Instance de ChatOllama
     */
    public static getInstance(params: { model: string, temperature?: number }): ChatOllama {
        const { model, temperature = 0.1 } = params;
        const key = `${model}_${temperature}`;

        if (!this.instances[key]) {
            this.instances[key] = OllamaClient.getInstance({
                model,
                temperature
            });
        }

        return this.instances[key];
    }

    /**
     * Supprime l'instance existante pour forcer la recréation
     * @param model Nom du modèle
     * @param temperature Température associée
     */
    public static resetInstance(model: string, temperature: number = 0.3): void {
        const key = `${model}_${temperature}`;
        if (this.instances[key]) {
            delete this.instances[key];
        }
    }
}