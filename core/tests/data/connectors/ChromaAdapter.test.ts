import { jest, describe, beforeAll, test, expect, afterAll } from "@jest/globals";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { DocumentInterface } from "@langchain/core/documents";
import { ChromaAdapter } from "../../../src/data/connectors/ChromaAdapter";
import { EmbeddingsInterface } from "@langchain/core/embeddings";
// Mock pour ChromaAdapter si nécessaire
const mockChromaAdapter = {
  collectionName: 'test_collection',
  addDocuments: jest.fn().mockResolvedValue(['1', '2'] as never),
  similaritySearch: jest.fn().mockResolvedValue([
    { pageContent: 'Ceci est un test', metadata: { source: 'test1' } },
    { pageContent: 'Ceci est un autre test', metadata: { source: 'test2' } },
  ] as never),
  delete: jest.fn().mockResolvedValue(true as never),
};

function createTestAdapter(collectionName: string) {
  return new ChromaAdapter(getEmbeddings(), {
    collectionName: collectionName,
    url: "http://localhost:8000",
  });
}


describe('ChromaAdapter', () => {
  let adapter: ChromaAdapter;
  const testCollectionName = 'test_collection';
  let isChromaAvailable = true;

  beforeAll(async () => {
    try {
      // Création d'une instance de test
      adapter = createTestAdapter(testCollectionName);
      // Test simple pour vérifier si Chroma est disponible
      const collection = await adapter.ensureCollection();
      console.log("🚀 ~ beforeAll ~ ensureCollection collection:", collection)
    } catch (error) {
      console.error('Chroma n\'est pas disponible, utilisation du mock :', error);
      isChromaAvailable = false;
      adapter = mockChromaAdapter as any;
      throw error;
    }
  });

  test('devrait créer une instance ChromaAdapter valide', () => {
    expect(adapter).toBeDefined();
    expect(adapter.collectionName).toBe(testCollectionName);
  });

  test('devrait pouvoir ajouter et récupérer des documents', async () => {
    const documents: DocumentInterface[] = [
      {
        pageContent: 'Ceci est un test',
        metadata: { source: 'test1' }
      },
      {
        pageContent: 'Ceci est un autre test',
        metadata: { source: 'test2' }
      },
    ];

    const testIds = ['1', '2'];

    try {
      // Ajout de documents
      const addedDocuments = await adapter.addDocuments(documents, { ids: testIds });
      console.log("🚀 ~ test ~ documents ajoutés", addedDocuments);

      // Recherche similaire
      const results = await adapter.similaritySearch('test', 2);
      console.log("🚀 ~ test ~ results:", results);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      // Si nous utilisons le mock, le test doit passer
      if (!isChromaAvailable) {
        expect(results.length).toBe(2);
      } else {
        expect(results.length).toBeGreaterThan(0);
      }
    } catch (error) {
      if (!isChromaAvailable) {
        console.warn('Test ignoré car Chroma n\'est pas disponible');
      } else {
        throw new Error(`Test échoué avec l'erreur : ${error}`);
      }
    }
  }, 10000);

  afterAll(async () => {
    if (isChromaAvailable) {
      try {
        // Nettoyage de la collection de test
        await adapter.delete_collection(testCollectionName);
        console.log("🚀 ~ afterAll ~ Nettoyage terminé");
      } catch (error) {
        console.error('Erreur lors du nettoyage :', error);
      }
    }
  });
});

function getEmbeddings(): EmbeddingsInterface {
  return new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGING_FACE_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2",
  });
}
