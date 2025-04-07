import type { Chroma } from "@langchain/community/vectorstores/chroma";
import { createChromaClient, getEmbeddings } from "./ChromaUtils";
import { Annotation } from "@langchain/langgraph";
import type { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import type { ChatMistralAI } from "@langchain/mistralai";
import MistralClient from "./MistralClient";
import type { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

export class Main {
    private chromaClient: Chroma;
    private promptTemplate!: ChatPromptTemplate;
    private llm: ChatMistralAI
    private emdeddingsFunction: HuggingFaceInferenceEmbeddings

    constructor() {
        this.chromaClient = createChromaClient();
        this.getPromptTemplate()
        this.llm = new MistralClient().client
        this.emdeddingsFunction = getEmbeddings();
    }
    public async askQuestion(conversation: ChatMessage[]) {

        const lastQuestion: ChatMessage = conversation[conversation.length - 1] ?? { role: 'user', content: '' }

        //on retrive à partir de la question
        const retrievedDocs = await this.retrieveContext({ question: lastQuestion.content })
        return this.generateResponse({
            context: retrievedDocs,
            question: conversation
        })

    }

    async getPromptTemplate() {
        const promptTemplate = await pull<ChatPromptTemplate>('rlm/rag-prompt')
        this.promptTemplate = promptTemplate
        return promptTemplate
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
