import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";
import MistralClient from "../Chat/MistralClient";

import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "@langchain/core/messages";

const config = { configurable: { thread_id: uuidv4() } };
const llm = new MistralClient().client;
const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });
const sendMessage = async (message: ChatMessage[]) => {
    const output = await app.invoke({ messages: message[message.length - 1] }, config);
   
    console.log(output.messages[output.messages.length - 1]);
    return output.messages[output.messages.length - 1];
}

export default app;

// class MemoryManager {
//     private llm: ChatMistralAI
//     private workflow: StateGraph<typeof MessagesAnnotation.State>
//     private memory: MemorySaver
//     private app: RunnableSequence;

//       constructor(){
//           this.llm = new MistralClient().client;
//           this.workflow = this.getworkflow();
//           this.memory = new MemorySaver();
//           this.app = this.workflow.compile({ checkpointer: this.memory });
//         }
//         // Define the function that calls the model
//         async callModel(state: typeof MessagesAnnotation.State) {
//             const response = await this.llm.invoke(state.messages);
//             return { messages: response };
//         };

//         getworkflow(){
//           return new StateGraph(MessagesAnnotation)
//           .addNode("model", this.callModel)
//           .addEdge(START, "model")
//           .addEdge("model", END);
//         }
//   }




