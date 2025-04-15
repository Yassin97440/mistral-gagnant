import DocumentProcessingParams from "./DocumentProcessingParams";
import type { Messages } from "@langchain/langgraph";
interface ChatParams {
    credentials: DocumentProcessingParams;
    MistralApiKey: string;
    MistralModel?: string;
    activeChat: {
        id: string;
        title: string;
        messages: Messages[];
    };
}

export default ChatParams;