
import { Annotation, type Messages } from "@langchain/langgraph";
import type { Document } from "langchain/document";

import { getNewMemoryConfig } from "../../../core/src/utils/memory/MemoryUtils";
import { compile } from "../../../core/src/workflow/Pipeline"; 
import type { BaseMessage } from "@langchain/core/messages";
import { isAIMessage } from "@langchain/core/messages";
import type { AIMessage } from "@langchain/core/messages";


export class Main {

    private config = getNewMemoryConfig();
    private graph = compile()
    constructor() { }
    public async askQuestion(conversation: Messages[]) {

        return await this.generateResponse({ context: [], question: conversation })

    }




    public generateResponse = async (state: typeof StateAnnotation.State) => {
        const lastMessage = state.question[state.question.length - 1] || { role: 'user', content: 'hello' };

        const response = await this.graph.invoke({ messages: lastMessage as Messages }, this.config);
        console.log("🚀 ~ Main ~ generateResponse= ~ response:", response.messages[response.messages.length - 1])
        return response.messages[response.messages.length - 1]?.content;
    };

    public generateResponseTestRag = async (state: typeof StateAnnotation.State) => {
        const lastMessage = state.question[state.question.length - 1] || { role: 'user', content: 'hello' };

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


}







export const StateAnnotation = Annotation.Root({
    question: (Annotation<Messages[]>),
    context: (Annotation<Document[]>),
});
