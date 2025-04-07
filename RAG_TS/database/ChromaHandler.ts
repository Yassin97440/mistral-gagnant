import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { HUGGING_FACE_API_KEY } from "../varEnv";



export function createChromaClient() {
    const embeddingFunction = getEmbeddings();
    // Utilisation de l'embedding par défaut via notre méthode

    const vectorStore = new Chroma(embeddingFunction, {
        collectionName: "rag-0.1",
        url: "http://localhost:8000",
    });

    return vectorStore;
}

function getEmbeddings() {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: HUGGING_FACE_API_KEY,
        model: "sentence-transformers/all-MiniLM-L6-v2",
    });
}
