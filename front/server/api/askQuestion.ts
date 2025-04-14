import { Main } from "~~/services/Chat/Main"
const main = new Main()

export default defineEventHandler(async (event) => {

    const chatBotMessages: [] = await readBody(event)
    const results = await main.askQuestion(chatBotMessages)


    return results

})