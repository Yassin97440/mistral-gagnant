import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";



export function createChromaClient() {
    const embeddingFunction = getEmbeddings();
    // Utilisation de l'embedding par défaut via notre méthode

    const vectorStore = new Chroma(embeddingFunction, {
        collectionName: "confluence-doc",
        url: "http://localhost:8000",
    });

    return vectorStore;
}

function getEmbeddings() {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: "",
        model: "sentence-transformers/all-MiniLM-L6-v2",
    });
}
