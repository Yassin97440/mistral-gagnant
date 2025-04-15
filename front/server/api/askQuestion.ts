import { Main } from "~~/services/Chat/Main"

export default defineEventHandler(async (event) => {
  const chatBotMessages = await readBody(event);
  // Utiliser le singleton pour maintenir l'état entre les appels
  const main = Main.getInstance();
  const results = await main.askQuestion(chatBotMessages);
  return results;
})