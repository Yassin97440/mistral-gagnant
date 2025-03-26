import { ChatMistralAI } from "@langchain/mistralai";
import { MISTRAL_API_KEY } from "./varEnv";

export class RAGUtils {


    public getLlm() {
      return new ChatMistralAI({
          model: "mistral-large-latest",
          temperature: 0,
          apiKey: MISTRAL_API_KEY
        });
    }
}