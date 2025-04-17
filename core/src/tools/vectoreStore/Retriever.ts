import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { getSupabaseVectorStore } from "../../data/connectors/SupabaseVectorStore";
import DocumentProcessingParams from "../../types/DocumentProcessingParams";

const retrieveSchema = z.object({ query: z.string() });
let vectorStore: SupabaseVectorStore ;

// Configuration globale qui peut être mise à jour
let processingConfig: DocumentProcessingParams;

// Fonction pour mettre à jour la configuration
export const updateRetrieverConfig = (config: DocumentProcessingParams) => {
  processingConfig = config;
  // Réinitialiser le vectorStore pour prendre en compte les nouvelles configurations
  vectorStore = getSupabaseVectorStore("documents", "match_documents", processingConfig);
};

const initVectorStore = async () => {
  if (!vectorStore && processingConfig) {
    vectorStore = getSupabaseVectorStore("documents", "match_documents", processingConfig);
  }
};

const retrieve = tool(
  async ({ query }) => {
    if (!vectorStore) await initVectorStore();
    
    const retrievedDocs = await vectorStore.similaritySearch(query.toString(), 4);

    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");

    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve information and context related to a query.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

export default retrieve;