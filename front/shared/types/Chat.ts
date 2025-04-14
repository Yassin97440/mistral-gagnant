import type { Messages } from "@langchain/langgraph";

//conversation entre user et assistant
export interface Chat {
    id: number;
    title: string;
    messages: Array<Messages>;
}
