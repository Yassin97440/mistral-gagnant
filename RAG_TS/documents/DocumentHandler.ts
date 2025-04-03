import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NotionClient } from "./NotionClient";
import { createChromaClient } from "../database/ChromaHandler"; 
import type { Chroma } from "@langchain/community/vectorstores/chroma";
import { NOTION_API_KEY, NOTION_DATABASE_ID } from "../varEnv";

export class DocumentHandler {
    private BATCH_SIZE = 50;
    private chromaClient: Chroma;
    private textSplitter: RecursiveCharacterTextSplitter;

    constructor() {
        this.chromaClient = createChromaClient();
        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
    }


    private async processDocumentsBatch(documents: DocumentsData[]) {
        for (const doc of documents) {
            const splits = await this.splitDocument(doc);
            // Créer des IDs uniques pour chaque chunk
            const chunkIds = splits.map((_, index) => `${doc.pageId}-chunk-${index}`);

            await this.chromaClient.addDocuments(splits);
        }
    }
    private async splitDocument(doc: DocumentsData) {
        const splits = await this.textSplitter.splitDocuments([{
            pageContent: doc.content,
            metadata: {
                create_date: doc.createdAt,
                id: doc.pageId
            }
        }]);
        console.log("nb de chunks pour le doc :", splits.length);
        console.log('visu chunks', splits.slice(0, 3));
        return splits;
    }

    async getAllDocumentsFromNotionDb(): Promise<DocumentsData[]> {
        const notionClient = new NotionClient(NOTION_API_KEY);
        const pagesIds = await notionClient.getPagesIdFromDatabase(NOTION_DATABASE_ID);
        console.log("🚀 ~ RAGMain ~ main ~ databaseResponse:", pagesIds);

        let allDocumentsContents : DocumentsData[] = [];
        for(let i = 0; i < pagesIds.length; i++){
            console.log(i)

            allDocumentsContents =  await notionClient.getPageContent(pagesIds[i])

        }
        console.debug("🚀 ~ RAGMain ~ main ~ page:", allDocumentsContents);
        return allDocumentsContents;
    }

    async processAllDocumentsWithPagination() {
        const notionClient = this.getNotionClient();

        const allDocuments = await this.getAllDocumentsFromNotionDb();

        console.log(`Total documents à traiter : ${allDocuments}`);

        for (let i = 0; i < allDocuments.length; i += this.BATCH_SIZE) {
            const batch = allDocuments.slice(i, i + this.BATCH_SIZE);
            console.log(`Traitement du lot ${i / this.BATCH_SIZE + 1}`);
            await this.processDocumentsBatch(batch);
        }

        console.log("Traitement terminé !");
    }

    private getNotionClient() {
        return new NotionClient(NOTION_API_KEY);
    }
}

export interface DocumentsData {
    pageId: string;
    title: string;
    content: string;
    createdAt: Date;
}



