import type { Chroma } from "@langchain/community/vectorstores/chroma";
import { createChromaClient, getEmbeddings } from "../RAG/ChromaUtils";
import { Annotation, type Messages } from "@langchain/langgraph";
import type { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import type { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import type { ChatMistralAI } from "@langchain/mistralai";
import MistralClient from "./MistralClient";

import { v4 as uuidv4 } from "uuid";

import DocumentRetriever from "../RAG/documents/Retriever";
import app from "../memory/MemoryManager";


export class Main {
    private chromaClient: Chroma;
    private promptTemplate!: ChatPromptTemplate;
    private llm: ChatMistralAI
    private emdeddingsFunction: HuggingFaceInferenceEmbeddings
    private documentRetriever: DocumentRetriever
    private app = app
    private config = { configurable: { thread_id: uuidv4() } };

    constructor() {
        this.chromaClient = createChromaClient("rag-0.1");
        
        this.getPromptTemplate()
        this.llm = new MistralClient().client
        this.emdeddingsFunction = getEmbeddings();
        this.documentRetriever = new DocumentRetriever();
    }
    public async askQuestion(conversation: ChatMessage[]) {
        const lastMessage = conversation[conversation.length - 1] || { role: 'user', content: 'hello' };
        console.log("🚀 ~ Main ~ askQuestion ~ lastMessage:", lastMessage)

       const response = await this.app.invoke({ messages: lastMessage as Messages }, this.config);
       console.log("🚀 ~ Main ~ askQuestion ~ response:", response.messages[response.messages.length - 1]);
       return response.messages[response.messages.length - 1]?.content;

        // const lastQuestion: ChatMessage = conversation[conversation.length - 1] ?? { role: 'user', content: '' }

        // const retrievedDocuments = await this.documentRetriever.getRelevantDocuments(lastQuestion.content)
        // return this.generateResponse({
        //     context: retrievedDocuments,
        //     question: conversation
        // })

    }

    async getPromptTemplate() {
        const promptTemplate = await pull<ChatPromptTemplate>('rlm/rag-prompt')
        this.promptTemplate = promptTemplate
        return promptTemplate
    }
    public getMistralLlm(): ChatMistralAI {
        return this.llm
    }


    public generateResponse = async (state: typeof StateAnnotation.State) => {
        const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
        const messages = await this.promptTemplate.invoke({
            question: state.question,
            context: docsContent,
        });
        const response = await this.llm.invoke(messages);
        console.log("🚀 ~ Main ~ generateResponse= ~ response:", response.content)
        return response.content;
    };

    public async retrieveContext(state: typeof InputStateAnnotation.State) {
        const retrievedDocs = await this.chromaClient.similaritySearch(state.question)
        return retrievedDocs
    }

}





export const InputStateAnnotation = Annotation.Root({
    question: (Annotation<string>),
});
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant',
    content: string
}
export const StateAnnotation = Annotation.Root({
    question: (Annotation<ChatMessage[]>),
    context: (Annotation<Document[]>),
});
