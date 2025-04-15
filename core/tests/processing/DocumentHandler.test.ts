import { DocumentHandler } from '../../src/processing/documents/DocumentHandler';
import { NotionClient } from '../../src/data/connectors/NotionClient';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { BlockData } from '../../src/types/BlockData';
import DocumentProcessingParams from '../../src/types/DocumentProcessingParams';
// Mock des dépendances
jest.mock('../../src/data/connectors/NotionClient');
jest.mock('../../src/data/connectors/SupabaseVectorStore', () => ({
  getSupabaseVectorStore: jest.fn().mockImplementation(() => ({
    addDocuments: jest.fn().mockResolvedValue(undefined as never)
  }))
}));
describe('DocumentHandler', () => {
  let documentHandler: DocumentHandler;
  let mockNotionClient: NotionClient;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    // jest.clearAllMocks();
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

    // Créer l'instance de DocumentHandler
    documentHandler = new DocumentHandler(processingConfig);
    
    // Mock NotionClient
    mockNotionClient = new NotionClient(process.env.NOTION_API_KEY || "");
    jest.spyOn(documentHandler as any, 'getNotionClient').mockReturnValue(mockNotionClient);
  });

  describe('processAllDocumentsWithPagination', () => {
    it('devrait traiter tous les documents par lots', async () => {
      // Données de test
      const mockDocuments: BlockData[] = Array(120).fill(null).map((_, index) => ({
        id: `doc-${index}`,
        pageId: `page-${index}`,
        parentId: `parent-${index}`,
        title: `Document ${index}`,
        authorName: 'Auteur Test',
        content: `Contenu du document ${index}`,
        createdAt: new Date(),
        documentType: ['test'],
        lastEdited: new Date()
      }));
      
      // Espionner les méthodes internes
      jest.spyOn(documentHandler, 'getAllDocumentsFromNotionDb').mockResolvedValue(mockDocuments);
      jest.spyOn(documentHandler as any, 'processDocumentsBatch').mockResolvedValue(undefined);
      
      // Exécuter la méthode
      await documentHandler.processAllDocumentsWithPagination();
      
      // Vérifier que getAllDocumentsFromNotionDb a été appelé
      expect(documentHandler.getAllDocumentsFromNotionDb).toHaveBeenCalledTimes(1);
      
      // Vérifier que processDocumentsBatch a été appelé avec les bons lots
      // Il devrait y avoir 3 lots de 50 documents (120 / 50 = 2.4 => 3 lots)
      expect((documentHandler as any).processDocumentsBatch).toHaveBeenCalledTimes(3);
      expect((documentHandler as any).processDocumentsBatch).toHaveBeenNthCalledWith(1, mockDocuments.slice(0, 50));
      expect((documentHandler as any).processDocumentsBatch).toHaveBeenNthCalledWith(2, mockDocuments.slice(50, 100));
      expect((documentHandler as any).processDocumentsBatch).toHaveBeenNthCalledWith(3, mockDocuments.slice(100, 120));
    });
    
    // it('devrait gérer le cas où il n\'y a pas de documents', async () => {
    //   // Mocker le retour d'un tableau vide
    //   jest.spyOn(documentHandler, 'getAllDocumentsFromNotionDb').mockResolvedValue([]);
    //   jest.spyOn(documentHandler as any, 'processDocumentsBatch').mockResolvedValue(undefined);
      
    //   await documentHandler.processAllDocumentsWithPagination();
      
    //   expect(documentHandler.getAllDocumentsFromNotionDb).toHaveBeenCalledTimes(1);
    //   expect((documentHandler as any).processDocumentsBatch).not.toHaveBeenCalled();
    // });
  });
});
