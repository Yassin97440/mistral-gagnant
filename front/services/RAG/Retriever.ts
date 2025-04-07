import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { MultiVectorRetriever } from "langchain/retrievers/multi_vector";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import MistralClient from "./MistralClient";
import { ChatMistralAI } from "@langchain/mistralai";
import type { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { createChromaClient, getEmbeddings } from "./ChromaUtils";

class Retriever {
  //  LLM pour reformulation & extraction
  private llm: ChatMistralAI;
  //  Embeddings
  private embeddings: HuggingFaceInferenceEmbeddings;
  //  Vector Store (ChromaDB)
  private vectorStore: Chroma;
  //  Retriever basique
  private baseRetriever: any;
  //  Rewriter de requêtes utilisateur
  private queryRewriter: RunnableSequence;
  //  Extracteur de passages importants
  private extractor: LLMChainExtractor;
  //  Hybrid Retriever (vector + mot-clé)
  private hybridRetriever: MultiVectorRetriever;
  //  SelfQueryRetriever pour filtrer par métadonnées
  private selfQueryRetriever: SelfQueryRetriever<Chroma>;
  //  Pipeline final
  private finalRetriever: RunnableSequence;

  constructor() {
    this.llm = new MistralClient().client

    this.embeddings = getEmbeddings();

     this.vectorStore = createChromaClient();
    this.baseRetriever = this.vectorStore.asRetriever(5);

    this.queryRewriter = RunnableSequence.from([
      this.llm,
      async (output: any) => output.text || output.content,
    ]);

    this.extractor = new LLMChainExtractor({
      llm: this.llm,
    } as any);

    this.hybridRetriever = new MultiVectorRetriever({
      vectorStore: this.vectorStore,
      documentExtractor: this.extractor,
      embeddingRetriever: this.baseRetriever,
    } as any);

    this.selfQueryRetriever = SelfQueryRetriever.fromLLM({
      llm: this.llm,
      vectorStore: this.vectorStore,
      documentContents: "Contenu du chunk",
      structuredQueryTranslator: {} as any,
      attributeInfo: [
        {
          name: "document_type",
          description: "Type de document (ex: note, projet, spec, etc.)",
          type: "string",
        },
        {
          name: "chunk_position",
          description: "Position dans le document (début, milieu, fin)",
          type: "string",
        },
        {
          name: "title",
          description: "Titre du document",
          type: "string",
        },
      ],
    });

    this.finalRetriever = RunnableSequence.from([
      async (query: string) => {
        const rewritten = await this.queryRewriter.invoke(query);
        console.log("📝 Query réécrite :", rewritten);
        return rewritten;
      },
      async (rewrittenQuery: string) => {
        return await this.hybridRetriever.getRelevantDocuments(rewrittenQuery);
      },
    ]);
    
  }

  async initialize() {
    this.vectorStore = await Chroma.fromExistingCollection(this.embeddings, {
      collectionName: "rivo_documents",
    });

    this.baseRetriever = this.vectorStore.asRetriever();

    this.queryRewriter = RunnableSequence.from([
      this.llm,
      async (output: any) => output.text || output.content,
    ]);

    this.extractor = new LLMChainExtractor({
      llm: this.llm,
    } as any);

    this.hybridRetriever = new MultiVectorRetriever({
      vectorStore: this.vectorStore,
      documentExtractor: this.extractor,
      embeddingRetriever: this.baseRetriever,
    } as any);

    this.selfQueryRetriever = await SelfQueryRetriever.fromLLM({
      llm: this.llm,
      vectorStore: this.vectorStore,
      documentContents: "Contenu du chunk",
      structuredQueryTranslator: {} as any,
      attributeInfo: [
        {
          name: "document_type",
          description: "Type de document (ex: note, projet, spec, etc.)",
          type: "string",
        },
        {
          name: "chunk_position",
          description: "Position dans le document (début, milieu, fin)",
          type: "string",
        },
        {
          name: "title",
          description: "Titre du document",
          type: "string",
        },
      ],
    });

    this.finalRetriever = RunnableSequence.from([
      async (query: string) => {
        const rewritten = await this.queryRewriter.invoke(query);
        console.log("📝 Query réécrite :", rewritten);
        return rewritten;
      },
      async (rewrittenQuery: string) => {
        return await this.hybridRetriever.getRelevantDocuments(rewrittenQuery);
      },
    ]);
  }

  async getRelevantDocuments(query: string) {
    return await this.finalRetriever.invoke(query);
  }
}

export default Retriever;
