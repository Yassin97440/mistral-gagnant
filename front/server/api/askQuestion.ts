import { Main } from "~~/services/Chat/Main"
import ChatParams from "../../../core/src/types/ChatParams";
export default defineEventHandler(async (event) => {
  const chatParams: ChatParams = await readBody(event);
  // Utiliser le singleton pour maintenir l'état entre les appels
  const main = Main.getInstance();
  const results = await main.askQuestion(chatParams);
  return results;
})