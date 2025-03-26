import { ChatMistralAI } from "@langchain/mistralai";


export class RAGUtils {


    public getLlm() {
      return new ChatMistralAI({
          model: "mistral-large-latest",
          temperature: 0
          
        });
    }
}