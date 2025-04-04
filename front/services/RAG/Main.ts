import type { Chroma } from "@langchain/community/vectorstores/chroma";
import { createChromaClient } from "./ChromaUtils";
import { Annotation } from "@langchain/langgraph";
import type { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import type { ChatMistralAI } from "@langchain/mistralai";
import MistralClient from "./MistralClient";
import type { DocumentInterface } from "@langchain/core/documents";

export class Main {
    private chromaClient: Chroma;
    private promptTemplate!: ChatPromptTemplate;
    private llm: ChatMistralAI

    constructor() {
        this.chromaClient = createChromaClient();
        this.getPromptTemplate()
        this.llm = new MistralClient().client
    }

    public async askQuestion(question: string) {
        const retrievedDocs = await this.retrieveContext({ question: question })
        //on retrive à partir de la question

        const response = this.generateResponse({
            context: retrievedDocs,
            question: question
        })
        //on génère 


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
        console.log(response)
        return { answer: response.content };
    };

    public async retrieveContext(state: typeof InputStateAnnotation.State) {
        const retrievedDocs = await this.chromaClient.similaritySearch(state.question)
        return retrievedDocs
    }

}





export const InputStateAnnotation = Annotation.Root({
    question: (Annotation<string>),
});

export const StateAnnotation = Annotation.Root({
    question: (Annotation<string>),
    context: (Annotation<Document[]>),
});
