import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const runtimeConfig = useRuntimeConfig()


export function createChromaClient() {
    const embeddingFunction = new HuggingFaceInferenceEmbeddings({
        apiKey: runtimeConfig.huggingFaceApiToken,
        model: "sentence-transformers/all-MiniLM-L6-v2",
    });
    // Utilisation de l'embedding par défaut via notre méthode

    const vectorStore = new Chroma(embeddingFunction, {
        collectionName: "notion-doc",
        url: "http://localhost:8000",
    });

    return vectorStore;
}



// Embedding mock qui ne fait rien (Chroma va utiliser le sien)
// class EmptyEmbeddings implements Embeddings {
//     async embedDocuments(texts: string[]): Promise<number[][]> {
//         return texts.map(() => []);
//     }
//     async embedQuery(text: string): Promise<number[]> {
//         return [];
//     }
// }

