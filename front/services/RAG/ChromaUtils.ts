import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const runtimeConfig = useRuntimeConfig()


export function createChromaClient(collectionName: string) {
    const embeddingFunction = getEmbeddings();

    const vectorStore = new Chroma(embeddingFunction, {
        collectionName: collectionName,
        url: "http://localhost:8000",
    });

    return vectorStore;
}




export function getEmbeddings() {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: runtimeConfig.huggingFaceApiToken,
        model: "sentence-transformers/all-MiniLM-L6-v2",
    });
}

