import {
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
} from "@langchain/core/messages";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";

import retrieve from "../tools/vectoreStore/Retriever";

import { ChatOllama } from "@langchain/ollama";
import { OllamaClientFactory } from "../LLM/OllamaClientFactory";
// const llm = MistralClient.getInstance().client;


export class ChatGraph {
    private static instance: ChatGraph;
    private graph: any;
    private model: string;
    private temperature: number;
    private tools = new ToolNode([retrieve]);
    private memory = new MemorySaver;

    private baseSystemPrompt =
        "You are an versatile assistant like Alfred from the movie 'The Dark Knight', or Jarvis from Iron Man." +
        // "You are able to answer questions and help with tasks. And also you can have a discussion with the user. " +
        "Use the following pieces of retrieved context to answer " +
        "the question. If you don't know the answer, use the retrieve tool to search for it. " +
        "Keep the answer concise." +
        "Respond in the language of the question. " +
        "If there is no real question, be humorous and ask for more information.";


    private constructor(model: string = "mistral", temperature: number = 0.0) {
        this.model = model;
        this.temperature = temperature;
        this.graph = this.compile();
    }


    public static getInstance(model?: string, temperature?: number): ChatGraph {
        if (!ChatGraph.instance ||
            (model && model !== ChatGraph.instance.model) ||
            (temperature && temperature !== ChatGraph.instance.temperature)) {
            ChatGraph.instance = new ChatGraph(model, temperature);
        }
        return ChatGraph.instance;
    }

    public getGraph() {
        return this.graph;
    }

    private getLlm(): ChatOllama {
        return OllamaClientFactory.getInstance({
            model: this.model,
            temperature: this.temperature
        });
    }

    // Step 1: Generate an AIMessage that may include a tool-call to be sent.
    async queryOrRespond(state: typeof MessagesAnnotation.State) {
        const llmWithTools = ChatGraph.instance.getLlm().bindTools([retrieve]);
        const systemUserPrompt = [
            new SystemMessage(ChatGraph.instance.baseSystemPrompt),
            ...state.messages
        ]

        const response = await llmWithTools.invoke(systemUserPrompt);
        // MessagesState appends messages to state instead of overwriting
        return { messages: [response] };
    }


    // Step 3: Generate a response using the retrieved content.
    async generate(state: typeof MessagesAnnotation.State) {
        // Get generated ToolMessages
        let recentToolMessages = [];
        const messages = state["messages"]
        for (let i = messages.length - 1; i >= 0; i--) {
            let message = messages[i];
            if (message instanceof ToolMessage) {
                recentToolMessages.push(message);
            } else {
                break;
            }
        }
        let toolMessages = recentToolMessages.reverse();

        // Format into prompt
        const docsContent = toolMessages.map((doc) => doc.content).join("\n");
        const systemMessageContent =
            this.baseSystemPrompt +
            "\n\n" +
            `${docsContent}`;

        const conversationMessages = state.messages.filter(
            (message) =>
                message instanceof HumanMessage ||
                message instanceof SystemMessage ||
                (message instanceof AIMessage && message.tool_calls?.length == 0)
        );
        const prompt = [
            new SystemMessage(systemMessageContent),
            ...conversationMessages,
        ];

        // Run
        const response = await ChatGraph.instance.getLlm().invoke(prompt);
        return { messages: [response] };
    }

    public compile() {
        const graphBuilder = new StateGraph(MessagesAnnotation)
            .addNode("queryOrRespond", this.queryOrRespond)
            .addNode("tools", this.tools)
            .addNode("generate", this.generate)
            .addEdge("__start__", "queryOrRespond")
            .addConditionalEdges("queryOrRespond", toolsCondition, {
                __end__: "__end__",
                tools: "tools",
            })
            .addEdge("tools", "generate")
            .addEdge("generate", "__end__");

        const graph = graphBuilder.compile({ checkpointer: this.memory });
        return graph
    }
}

