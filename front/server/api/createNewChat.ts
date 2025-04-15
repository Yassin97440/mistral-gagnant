import { createNewChat } from "~~/services/Chat/chatUtils"


export default defineEventHandler(async (event) => {

    const newChat = createNewChat()


    return newChat

})