import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

export function getEmbeddings() {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGING_FACE_API_KEY,
        model: "sentence-transformers/all-MiniLM-L6-v2",
    });
}