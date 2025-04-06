import { Client } from '@notionhq/client';
import { GetPageResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { BlockData } from './DocumentHandler';
import { NotionPageUtils } from './notionContent/NotionPageUtils';

interface NotionPageData {
    id: string,
    title: string,
    categories: string[],
    authorName: string,
    status: string,
    createdDate: Date
    lastUpdateDate: Date
}

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

        return await this.client.databases.query({
            database_id: databaseId,
            filter: filter,
        });

    }


    /**
     * Extrait les IDs de pages à partir d'une réponse de requête de base de données
     * @returns Un tableau contenant tous les IDs de pages
     */
    async getPagesDataFromDatabase(databaseId: string): Promise<NotionPageData[]> {
        try {
            const response = await this.queryDatabase(databaseId);

            // Extraire les IDs de chaque page dans les résultats
            const pageIds = response.results.map(page => {
                const pageData : NotionPageData = {
                    id: NotionPageUtils.getPageId(page),
                    title: NotionPageUtils.getPageTitle(page),
                    authorName: NotionPageUtils.getPageAuthor(page),
                    createdDate: NotionPageUtils.getPageCretiondate(page),
                    lastUpdateDate: NotionPageUtils.getPageLastUpdatedDate(page),
                    categories: NotionPageUtils.getPageCategories(page),
                    status: NotionPageUtils.getPageStatus(page)
                }
                console.log("🚀 ~ NotionClient ~ getPagesDataFromDatabase ~ pageData:", pageData)
                return pageData
            });
            

            return pageIds;
        } catch (error) {
            console.error('Erreur lors de l\'extraction des IDs de pages:', error);
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

    /**
     * Récupère le contenu d'un bloc spécifique
     * @param blockId L'ID du bloc à récupérer
     * @returns L'objet JSON représentant le bloc
     */
    getBlockContent(block: any): BlockData {
        const newBlock: BlockData = { id: block?.parent?.page_id, title: "", content: "", createdAt: block?.created_time };
        newBlock.content += block?.paragraph?.rich_text.map((richTxt: any) => richTxt.plain_text);
        return newBlock;
    }

    /**
     * Récupère le contenu de plusieurs blocs à partir de leurs IDs
     * @param blocks Tableau d'IDs de blocs à récupérer
     * @returns Un tableau d'objets JSON représentant les blocs
     */
    getMultipleBlocks(blocks: []): BlockData[] {
        return blocks.map(blockId => this.getBlockContent(blockId));

    }

    async getPageBlocks(blockId: string): Promise<any> {
        try {
            return await this.client.blocks.children.list({
                block_id: blockId,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du contenu de la page:', error);
            throw error;
        }
    }

    async getPageContent(pageId: string): Promise<BlockData[]> {
        try {
            const pageBlocks = await this.getPageBlocks(pageId);
            // console.log("🚀 ~ NotionClient ~ getPageContent ~ pageBlocks:", pageBlocks)
            const allPageContent = this.getMultipleBlocks(pageBlocks.results);
            return allPageContent;

        } catch (error) {
            console.error('Erreur lors de la récupération du contenu de la page:', error);
            throw error;
        }
    }
}