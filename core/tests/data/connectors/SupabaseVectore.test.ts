import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getEmbeddings } from "../../../src/processing";
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { getSupabaseVectorStore } from "../../../src/data/connectors/SupabaseVectorStore";
// Mock des dépendances
jest.mock("@langchain/community/vectorstores/supabase");
jest.mock("@supabase/supabase-js");
jest.mock("../../../src/processing");

describe('SupabaseVectore', () => {
  let mockSupabaseClient: SupabaseVectorStore;
  let mockEmbeddings: HuggingFaceInferenceEmbeddings;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Configurer les mocks
    mockSupabaseClient = getSupabaseVectorStore("documents", "match_documents") ;
    mockEmbeddings = getEmbeddings();
    
  });

  it('initialise correctement le vectorStore avec les bonnes valeurs', () => {
    // Configurer l'environnement pour le test

    // Importer le module après avoir configuré les mocks et l'environnement
    jest.isolateModules(() => {
      // Cette importation déclenche l'exécution du code dans le module
      require('../../../src/data/connectors/SupabaseVectorStore');
      console.log("mockSupabaseClient", getSupabaseVectorStore("documents", "match_documents").client);
      // Vérifier que createClient a été appelé avec les bonnes valeurs
      expect(createClient).toHaveBeenCalledWith(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_PRIVATE_KEY
      );
      
      // Vérifier que SupabaseVectorStore a été instancié avec les bons paramètres
    //   expect(mockSupabaseClient).toHaveBeenCalledWith(
    //     {
    //       tableName: 'documents',
    //       queryName: 'match_documents'
    //     }
    //   );
    });

  });

  
});
