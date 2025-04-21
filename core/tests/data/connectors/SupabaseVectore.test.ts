import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getEmbeddings } from "../../../src/processing";
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { getSupabaseVectorStore } from "../../../src/data/connectors/SupabaseVectorStore";
import DocumentProcessingParams from "../../../src/types/DocumentProcessingParams";
// Mock des dépendances
jest.mock("@langchain/community/vectorstores/supabase");
jest.mock("@supabase/supabase-js");
jest.mock("../../../src/processing");

describe('SupabaseVectore', () => {
  let mockSupabaseClient: SupabaseVectorStore;
  let mockEmbeddings: HuggingFaceInferenceEmbeddings;

  const processingConfig: DocumentProcessingParams = {
    chunkSize: 500,
    chunkOverlap: 50,
    notionApiKey: process.env.NOTION_API_KEY || "",
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseApiKey: process.env.SUPABASE_API_KEY || "",
    huggingfaceApiKey: process.env.HUGGING_FACE_API_KEY || "",
    mistralApiKey: process.env.MISTRAL_API_KEY || "",
    notionDatabaseId: process.env.NOTION_DATABASE_ID || ""
  };
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();

    // Configurer les mocks
    mockSupabaseClient = getSupabaseVectorStore("documents", "match_documents", processingConfig);
    mockEmbeddings = getEmbeddings(processingConfig);

  });

  it('initialise correctement le vectorStore avec les bonnes valeurs', () => {

    jest.isolateModules(() => {
      require('../../../src/data/connectors/SupabaseVectorStore');

      const vectorStore = getSupabaseVectorStore("documents", "match_documents", processingConfig);

      expect(vectorStore.client).toHaveBeenCalledWith(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_PRIVATE_KEY
      );


    });

  });


});
