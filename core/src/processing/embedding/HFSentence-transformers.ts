import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import DocumentProcessingParams from "../../types/DocumentProcessingParams";

export function getEmbeddings(credentials: DocumentProcessingParams) {
    return new HuggingFaceInferenceEmbeddings({
        apiKey: credentials.huggingfaceApiKey,
        model: "sentence-transformers/all-MiniLM-L6-v2",
    });
}