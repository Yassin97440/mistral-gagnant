import {
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
} from "@langchain/core/messages";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";

import retrieve from "../tools/vectoreStore/Retriever";
import { MistralClient } from "../LLM/MistralClient";

const llm = new MistralClient().client;
const tools = new ToolNode([retrieve]);
const memory = new MemorySaver;

// Step 1: Generate an AIMessage that may include a tool-call to be sent.
async function queryOrRespond(state: typeof MessagesAnnotation.State) {
    const llmWithTools = llm.bindTools([retrieve]);
    const response = await llmWithTools.invoke(state.messages);
    // MessagesState appends messages to state instead of overwriting
    return { messages: [response] };
}


// Step 3: Generate a response using the retrieved content.
async function generate(state: typeof MessagesAnnotation.State) {
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
        "You are an assistant for question-answering tasks. " +
        "Use the following pieces of retrieved context to answer " +
        "the question. If you don't know the answer, say that you " +
        "don't know. Use three sentences maximum and keep the " +
        "answer concise." +
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
    const response = await llm.invoke(prompt);
    return { messages: [response] };
}

function compile() {
    const graphBuilder = new StateGraph(MessagesAnnotation)
        .addNode("queryOrRespond", queryOrRespond)
        .addNode("tools", tools)
        .addNode("generate", generate)
        .addEdge("__start__", "queryOrRespond")
        .addConditionalEdges("queryOrRespond", toolsCondition, {
            __end__: "__end__",
            tools: "tools",
        })
        .addEdge("tools", "generate")
        .addEdge("generate", "__end__");

    const graph = graphBuilder.compile({ checkpointer: memory });
    return graph
}

export { compile }