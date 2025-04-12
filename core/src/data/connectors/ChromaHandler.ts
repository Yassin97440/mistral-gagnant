import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";




export function createChromaClient(collectionName: string) {
    const embeddingFunction = getEmbeddings();

    const vectorStore = new Chroma(embeddingFunction, {
        collectionName: collectionName,
        url: "http://localhost:8000",
    });

    return vectorStore;
}


function getEmbeddings() {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGING_FACE_API_KEY,
        model: "sentence-transformers/all-MiniLM-L6-v2",
    });
}
