import { Main } from "~~/services/RAG/Main"
const main = new Main()

export default defineEventHandler(async (event) => {

    const chatBotMessages: [] = await readBody(event)
    console.log(chatBotMessages)
    const results = await main.askQuestion(chatBotMessages)

    return results

})