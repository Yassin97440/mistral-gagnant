import { v4 as uuidv4 } from "uuid";
export const createNewChat = (): Chat => {


    return {
        id: uuidv4(),
        title: "Nouvelle conversation",
        messages: []
    }
}