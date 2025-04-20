import { Annotation, type Messages } from "@langchain/langgraph";
import type { Document } from "langchain/document";

import type { BaseMessage } from "@langchain/core/messages";
import { isAIMessage } from "@langchain/core/messages";
import type { AIMessage } from "@langchain/core/messages";
import { ChatGraph, getMemoryConfig } from "@yassin97440/mistral-gagnant";
import { updateRetrieverConfig } from "@yassin97440/mistral-gagnant";
import type ChatParams from "../../../core/dist/types/ChatParams";

export class Main {
    private static instance: Main;
    private graph: any;
    private initialized: boolean = false;

    private constructor() { }

    public static getInstance(): Main {
        if (!Main.instance) {
            Main.instance = new Main();
        }
        return Main.instance;
    }

    public async initialize(chatParams: ChatParams): Promise<void> {

        updateRetrieverConfig(chatParams.credentials);

        const graphManager = ChatGraph.getInstance(chatParams.model || "mistral", chatParams.temperature || 0.1);
        this.graph = graphManager.getGraph();
        this.initialized = true;
    }

    public async askQuestion(chatParams: ChatParams): Promise<any> {
        await this.initializeIfNeeded(chatParams);
        return await this.generateResponse(chatParams);
    }


    private async initializeIfNeeded(chatParams: ChatParams) {
        if (!this.initialized) {
            await this.initialize(chatParams);
        }
        if (this.graph.model !== chatParams.model || this.graph.temperature !== chatParams.temperature) {
            await this.initialize(chatParams);
        }
    }

    private async generateResponse(chatParams: ChatParams) {
        const lastMessage = chatParams.activeChat.messages[chatParams.activeChat.messages.length - 1] || { role: 'user', content: 'hello' };
        const memoryConfig = getMemoryConfig(chatParams.activeChat.id);
        // Exécuter le graphe avec la question
        const response = await this.graph.invoke({ messages: lastMessage as Messages, history: chatParams.activeChat.messages }, memoryConfig);

        return response.messages[response.messages.length - 1]?.content;
    }

    /**
     * Pour avoir plus de logs au niveau de la pipeline
     * (log du tool retriever, et document retrievé)
     * @param state 
     * @param chatId 
     */
    public generateResponseTestRag = async (state: typeof StateAnnotation.State, chatId: string) => {
        const lastMessage = state.question[state.question.length - 1] || { role: 'user', content: 'hello' };
        const memoryConfig = getMemoryConfig(chatId);
        for await (const step of await this.graph.stream({ messages: lastMessage as Messages }, {
            streamMode: "values",
            configurable: { thread_id: memoryConfig.configurable.thread_id }
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

}

export const StateAnnotation = Annotation.Root({
    question: (Annotation<Messages[]>),
    context: (Annotation<Document[]>),
});
