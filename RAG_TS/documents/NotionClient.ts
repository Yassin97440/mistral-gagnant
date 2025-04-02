import { Client } from '@notionhq/client';
import { GetPageResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

export class NotionClient {
    private client: Client;
    
    constructor(apiKey: string) {
        this.client = new Client({
            auth: apiKey,
        });
    }
    
    async getPage(pageId: string): Promise<GetPageResponse> {
        try {
            return await this.client.pages.retrieve({ page_id: pageId });
        } catch (error) {
            console.error('Erreur lors de la récupération de la page:', error);
            throw error;
        }
    }
    
    async queryDatabase(databaseId: string, filter?: any): Promise<QueryDatabaseResponse> {
        try {
            return await this.client.databases.query({
                database_id: databaseId,
                filter: filter,
            });
        } catch (error) {
            console.error('Erreur lors de la requête à la base de d ,onnées:', error);
            throw error;
        }
    }
    
    async updatePage(pageId: string, properties: any): Promise<GetPageResponse> {
        try {
            return await this.client.pages.update({
                page_id: pageId,
                properties: properties,
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la page:', error);
            throw error;
        }
    }
    
    async getPageContent(blockId: string): Promise<any> {
        try {
            return await this.client.blocks.children.list({
                block_id: blockId,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du contenu de la page:', error);
            throw error;
        }
    }
}