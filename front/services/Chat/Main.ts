import type { Chroma } from "@langchain/community/vectorstores/chroma";
import { createChromaClient, getEmbeddings } from "../RAG/ChromaUtils";
import { Annotation, type Messages } from "@langchain/langgraph";
import type { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import type { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import type { ChatMistralAI } from "@langchain/mistralai";
import MistralClient from "./MistralClient";

import { getNewMemoryConfig } from "../../../core/src/utils/memory/MemoryUtils";
import { compile } from "../../../core/src/workflow/Pipeline"; 
import type { BaseMessage } from "@langchain/core/messages";
import { isAIMessage } from "@langchain/core/messages";
import type { AIMessage } from "@langchain/core/messages";


export class Main {
    private chromaClient: Chroma;
    private promptTemplate!: ChatPromptTemplate;
    private llm: ChatMistralAI
    private emdeddingsFunction: HuggingFaceInferenceEmbeddings
    private config = getNewMemoryConfig();
    private graph = compile()
    constructor() {
        this.chromaClient = createChromaClient("rag-0.1");

        this.getPromptTemplate()
        this.llm = new MistralClient().client
        this.emdeddingsFunction = getEmbeddings();
    }
    public async askQuestion(conversation: ChatMessage[]) {

        this.generateResponseTestRag({ context: [], question: conversation })
      
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
        const lastMessage = state.question[state.question.length - 1] || { role: 'user', content: 'hello' };
        console.log("🚀 ~ Main ~ askQuestion ~ lastMessage:", lastMessage)

        const response = await this.graph.invoke({ messages: lastMessage as Messages }, this.config);
        console.log("🚀 ~ Main ~ generateResponse= ~ response:", response.messages[response.messages.length - 1])
        return response.messages[response.messages.length - 1]?.content;
    };

    public generateResponseTestRag = async (state: typeof StateAnnotation.State) => {
        const lastMessage = state.question[state.question.length - 1] || { role: 'user', content: 'hello' };
        console.log("🚀 ~ Main ~ askQuestion ~ lastMessage:", lastMessage)

        for await (const step of await this.graph.stream({ messages: lastMessage as Messages }, {
            streamMode: "values",
            configurable: { thread_id: this.config.configurable.thread_id }
        })) {
            const lastMessage = step.messages[step.messages.length - 1];
            this.prettyPrint(lastMessage);
            console.log("-----\n");
        }
    };


    prettyPrint = (message: BaseMessage) => {
        let txt = `[${message.getType()}]: ${message.content}`;
        if ((isAIMessage(message) && message.tool_calls?.length) || 0 > 0) {
            const tool_calls = (message as AIMessage)?.tool_calls
                ?.map((tc) => `- ${tc.name}(${JSON.stringify(tc.args)})`)
                .join("\n");
            txt += ` \nTools: \n${tool_calls}`;
        }
        console.log(txt);
    };


    async retrieveContext(state: typeof InputStateAnnotation.State) {
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
