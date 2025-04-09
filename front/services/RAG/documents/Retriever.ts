import { Chroma } from "@langchain/community/vectorstores/chroma";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { MultiVectorRetriever } from "langchain/retrievers/multi_vector";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { RunnableSequence } from "@langchain/core/runnables";
import MistralClient from "../../Chat/MistralClient";
import { ChatMistralAI } from "@langchain/mistralai";
import type { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { createChromaClient, getEmbeddings } from "../ChromaUtils";
import { InMemoryDocstore } from "langchain/stores/doc/in_memory";
import { Document } from "@langchain/core/documents";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";

class DocumentRetriever {
  //  LLM pour reformulation & extraction
  private llm: ChatMistralAI;
  //  Embeddings
  private embeddings: HuggingFaceInferenceEmbeddings;
  //  Vector Store (ChromaDB)
  private vectorStore: Chroma;
  //  Retriever basique
  private baseRetriever: VectorStoreRetriever;
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
  // Docstore pour stocker les documents
  private docstore: InMemoryDocstore;

  constructor() {
    this.llm = new MistralClient().client

    this.embeddings = getEmbeddings();
    this.vectorStore = createChromaClient("rag-0.1");
    this.baseRetriever = this.vectorStore.asRetriever();

    // Créer un docstore pour stocker les documents
    this.docstore = new InMemoryDocstore(new Map());

    // Ajouter un document initial au docstore pour éviter des erreurs
    const sampleDoc = new Document({
      pageContent: "Document initial pour tester le retriever",
      metadata: { doc_id: "initial_doc_1" }
    });
    this.docstore.add({ "initial_doc_1": sampleDoc });

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
      byteStore: this.docstore,
      docstore: this.docstore,
      idKey: "doc_id", // Définir la clé d'ID pour les documents
      childK: 10,       // Nombre de documents enfants à récupérer
      parentK: 5,       // Nombre de documents parents à retourner
      ensureUniqueIdsExistInDocstore: false
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

    // Utiliser le SimpleRetriever au lieu du MultiVectorRetriever pour commencer
    this.finalRetriever = RunnableSequence.from([
      async (query: string) => {
        const rewritten = await this.queryRewriter.invoke(`Reformule la requête suivante pour améliorer sa pertinence lors d’une recherche dans une base de documents vectorisée. reformule et ajoute de petites infos pertinentes : ${query}`);
        console.log("📝 Query réécrite :", rewritten);
        return rewritten;
      },
      async (rewrittenQuery: string) => {
        // Utiliser directement le baseRetriever pour éviter les problèmes avec MultiVectorRetriever
        try {
          console.log("🔎 Recherche avec baseRetriever");
          //fonctionne que avec basic retriever pour le moment.. on verra plus ard pour un hybrid retriver
          const res = await this.baseRetriever.invoke(rewrittenQuery);
          console.log("🚀 ~ DocumentRetriever ~ res:", res)
          
          return res
        } catch (error) {
          console.error("❌ Erreur avec baseRetriever:", error);
          // Fallback sur similaritySearch directement
          console.log("🔄 Fallback sur similaritySearch");
          return await this.vectorStore.similaritySearch(rewrittenQuery, 10);
        }
      },
    ]);
  }

  async getRelevantDocuments(query: string) {
    try {
      console.log("📝 Recherche de documents pour:", query);
      return await this.finalRetriever.invoke(query);
    } catch (error) {
      console.error("❌ Erreur lors de la recherche:", error);
      // Fallback sur une recherche simple
      return await this.vectorStore.similaritySearch(query, 5);
    }
  }
}

export default DocumentRetriever;
