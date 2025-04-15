import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotionClient } from '../../../src/data/connectors/NotionClient';
import { Client } from '@notionhq/client';

// Mock de la bibliothèque @notionhq/client
jest.mock('@notionhq/client');

describe('NotionClient', () => {
  let notionClient: NotionClient;
  let mockClient: any;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    
    // Créer un mock pour la méthode databases.query
    mockClient = {
      databases: {
        query: jest.fn().mockResolvedValue({
          results: [
            { id: 'page1' },
            { id: 'page2' }
          ]
        } as never)
      }
    };
    
    // Remplacer le constructeur de Client pour retourner notre mock
    (Client as unknown as jest.Mock).mockImplementation(() => mockClient);
    
    // Instancier NotionClient avec le mock
    notionClient = new NotionClient(process.env.NOTION_API_KEY || "");
  });

  describe('queryDatabase', () => {
    it('appelle la méthode query avec les bons paramètres', async () => {
      const databaseId = 'db123';
      const filter = { property: 'Status', equals: 'En cours' };
      
      await notionClient.queryDatabase(databaseId, filter);
      
      expect(mockClient.databases.query).toHaveBeenCalledWith({
        database_id: databaseId,
        filter: filter
      });
    });
    
    it('retourne la réponse du client Notion', async () => {
      const mockResponse = {
        results: [
          { id: 'page1' },
          { id: 'page2' }
        ]
      };
      mockClient.databases.query.mockResolvedValue(mockResponse);
      
      const result = await notionClient.queryDatabase('db123');
      
      expect(result).toEqual(mockResponse);
    });
    
    it('fonctionne sans filtre', async () => {
      const databaseId = 'db123';
      
      await notionClient.queryDatabase(databaseId);
      
      expect(mockClient.databases.query).toHaveBeenCalledWith({
        database_id: databaseId,
        filter: undefined
      });
    });
  });
}); 