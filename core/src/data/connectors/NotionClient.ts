import { Client } from '@notionhq/client';
import { GetPageResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { BlockData } from "../../types/BlockData";
import { NotionPageUtils } from '../../utils/notionContent/NotionPageUtils';
import { NotionPageData } from '../../types/NotionPageData';

export class NotionClient {
    private client: Client;

    constructor(notionApiKey: string) {
        this.client = new Client({
            auth: notionApiKey,
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
     * Extrait les data de pages à partir d'une réponse de requête de base de données
     * @returns Un tableau contenant tous les data de pages
     */
    async getPagesDataFromDatabase(databaseId: string): Promise<NotionPageData[]> {
        try {
            const response = await this.queryDatabase(databaseId);
            const pagesData = response.results.map(page => {
                const pageData: NotionPageData = {
                    id: NotionPageUtils.getPageId(page),
                    parentId: NotionPageUtils.getPageParentId(page),
                    title: NotionPageUtils.getPageTitle(page),
                    authorName: NotionPageUtils.getPageAuthor(page),
                    createdDate: NotionPageUtils.getPageCretiondate(page),
                    lastUpdateDate: NotionPageUtils.getPageLastUpdatedDate(page),
                    categories: NotionPageUtils.getPageCategories(page),
                    status: NotionPageUtils.getPageStatus(page)
                }
                return pageData
            });


            return pagesData;
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
     * @param block L'objet JSON représentant le bloc
     * @param page L'objet JSON représentant la page
     * @returns Le contenu du bloc
     */
    extractBlockContent(block: any, page: NotionPageData): string {
        var content = ""
        return content += block?.paragraph?.rich_text.map((richTxt: any) => richTxt.plain_text).join("");
    }

    /**
     * Récupère le contenu de plusieurs blocs
     * @param blocks Tableau des blocs à récupérer
     * @param page L'objet JSON représentant la page parente
     * @returns Un tableau d'objets JSON représentant les blocs
     */
    extractAllBlocksData(blocks: [], page: NotionPageData): BlockData {
        const newBlock: BlockData = {
            id: page.id,
            parentId: page.parentId,
            pageId: page.id,
            content: "",
            title: page.title,
            createdAt: page.createdDate,
            documentType: page.categories,
            authorName: page.authorName
        };
        const content = blocks.map(blockId => this.extractBlockContent(blockId, page));
        newBlock.content = content
            .filter(text => text !== "undefined" && text !== "")
            .join("");
        return newBlock;

    }

    /**
     * Récupère les blocs enfants d'une page (ou block) spécifique
     * @param blockId L'ID du bloc parent
     * @returns Un tableau d'objets JSON représentant les blocs enfants
     */
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

    /**
     * Récupère le contenu d'une page
     * @param page L'objet JSON représentant les métadata de la page
     * @returns Un objet JSON représentant le contenu de la page
     */
    async getPageContent(page: NotionPageData): Promise<BlockData> {
        try {
            const pageBlocks = await this.getPageBlocks(page.id);
            const allPageContent =  this.extractAllBlocksData(pageBlocks.results, page);
            console.log("🚀 ~ NotionClient ~ getPageContent ~ allPageContent:", allPageContent)
            return allPageContent;

        } catch (error) {
            console.error('Erreur lors de la récupération du contenu de la page:', error);
            throw error;
        }
    }
}