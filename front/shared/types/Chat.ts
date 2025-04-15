import type { Messages } from "@langchain/langgraph";

//conversation entre user et assistant
export interface Chat {
    id: string;
    title: string;
    messages: Array<Messages>;
}
