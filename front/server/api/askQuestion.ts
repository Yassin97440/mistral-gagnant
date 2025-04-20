import { Main } from "~~/services/Chat/Main"
import ChatParams from "../../../core/dist/types/ChatParams";
export default defineEventHandler(async (event) => {
  const chatParams: ChatParams = await readBody(event);
  const main = Main.getInstance();
  const results = await main.askQuestion(chatParams);
  return results;
})