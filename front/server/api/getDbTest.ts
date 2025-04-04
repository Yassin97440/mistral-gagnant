import { Main } from "~~/services/RAG/Main"

const main = new Main()
export default defineEventHandler(async (event) => {
    const query = "Développement : Déblocage des commandes bloquées en SUPPLYING? ";
    const results = await main.askQuestion(query)

    console.log(results);
})