import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NotionClient } from "./NotionClient";
import { createChromaClient } from "../database/ChromaHandler";
import type { Chroma } from "@langchain/community/vectorstores/chroma";
import { NOTION_API_KEY, NOTION_DATABASE_ID } from "../varEnv";
import { CustomJsonSplitter } from "./CustomJsonSplitter";

export class DocumentHandler {
    private BATCH_SIZE = 50;
    private chromaClient: Chroma;
    private chunkSize : number
    private chunkOverlap : number

    constructor(
        chunkSize: number,
        chunkOverlap: number) {
        this.chromaClient = createChromaClient();
        this.chunkSize = chunkSize;
        this.chunkOverlap = chunkOverlap;

    }

    async processAllDocumentsWithPagination() {

        const allDocuments = await this.getAllDocumentsFromNotionDb();

        console.log(`Total documents à traiter : ${allDocuments}`);

        for (let i = 0; i < allDocuments.length; i += this.BATCH_SIZE) {
            const batch = allDocuments.slice(i, i + this.BATCH_SIZE);
            console.log(`Traitement du lot ${i / this.BATCH_SIZE + 1}`);
            await this.processDocumentsBatch(batch);
        }

        console.log("Traitement terminé !");
    }

 private async processDocumentsBatch(documents: BlockData[]) {
        let totalChunksAddedToDb = 0;
        for (const doc of documents) {
            // console.log("🚀 ~ DocumentHandler ~ processDocumentsBatch ~ doc:", doc)
            if (!doc.content || doc.content.length == 0 || doc.content === 'undefined')
                continue;
            const splits = await this.splitDocument(doc);
            // Créer des IDs uniques pour chaque chunk
            const chunkIds = splits.map((_, index) => `${doc.id}-chunk-${index}`);
            await this.chromaClient.addDocuments(splits);
            totalChunksAddedToDb += 1;
            console.warn("CHUNCKED ADDED IN CHROMA ");
        }
        console.log("🚀 ~ DocumentHandler ~ processDocumentsBatch ~ totalChunksAddedToDb for chunck:", totalChunksAddedToDb)
    }

    async getAllDocumentsFromNotionDb(): Promise<BlockData[]> {
        const notionClient = this.getNotionClient();
        const pages = await notionClient.getPagesDataFromDatabase(NOTION_DATABASE_ID);

        let allDocumentsContents: BlockData[] = [];
        for (let i = 0; i < pages.length; i++) {

            allDocumentsContents.push(await notionClient.getPageContent(pages[i]))
            console.info("🚀 ~ DocumentHandler ~ getAllDocumentsFromNotionDb ~ allDocumentsContents: page terminé ", i)

        }
        return allDocumentsContents;
    }

    private getNotionClient() {
        return new NotionClient(NOTION_API_KEY);
    }


    private async splitDocument(doc: BlockData) {

        // D'abord splitter le contenu sans métadonnées
        const splitter = new CustomJsonSplitter({ chunkSize: this.chunkSize, chunkOverlap: this.chunkOverlap });

        const jsonChunks = await splitter.splitJsonWithLangchain(doc.content);


        // Ensuite, enrichir chaque chunk avec des métadonnées spécifiques
        return jsonChunks.map((split, index) => {
            split.metadata = {
                "create_date": doc.createdAt,
                "id": doc.id,
                "title": doc.title,
                "parent_id": doc.id,
                "document_type": doc.documentType,
                "last_edited": doc.lastEdited,
                
                "chunk_index": index,
                "chunk_total": jsonChunks.length,
                
                // Information sur le contenu du chunk
                "chunk_summary": `Partie ${index+1}/${jsonChunks.length} de ${doc.title}`,
                "chunk_position": index === 0 ? "début" : index === jsonChunks.length - 1 ? "fin" : "milieu",
                
                // chunk_keywords: extractKeywords(split.pageContent)
            };
            console.log("🚀 ~ DocumentHandler ~ returnjsonChunks.map ~ split:", split)
            return split;
        });
    }




}

export interface BlockData {
    id: string;
    pageId: string;
    parentId: string;
    title: string;
    authorName: string,
    content: string;
    createdAt: Date;
    documentType?: string[];
    lastEdited?: Date;
}



