import { ChatMistralAI } from "@langchain/mistralai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { MISTRAL_API_KEY } from "./varEnv";
import { OpenAIEmbeddings } from "@langchain/openai";
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";



export class RAGUtils {


  public getLlm() {
    return new ChatMistralAI({
      model: "mistral-large-latest",
      temperature: 0,
      apiKey: MISTRAL_API_KEY
    });
  }

  public getEmbeddings() {
    // Utiliser l'embedding par défaut de Chroma
    return new OpenAIEmbeddings({
      openAIApiKey: "not-needed" // Trick pour utiliser l'embedding par défaut de Chroma
    });
  }

  public createChromaClient() {
    // Utilisation de l'embedding par défaut via notre méthode
    const embeddings = this.getEmbeddings();

    const vectorStore = new Chroma(embeddings, {
      collectionName: "a-test-collection",
    });

    return vectorStore;
  }

  public async loadingDocuments() {
    const pTagSelector = "p";
    const cheerioLoader = new CheerioWebBaseLoader(
      "https://lilianweng.github.io/posts/2023-06-23-agent/",
      {
        selector: pTagSelector,
      }
    );

    const docs = await cheerioLoader.load();

    console.assert(docs.length === 1);
    console.log(`Total characters: ${docs[0].pageContent.length}`);
  }
}