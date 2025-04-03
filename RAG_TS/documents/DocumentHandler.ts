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


    private async processDocumentsBatch(documentes: { id: string, content: string, title: string }[]) {
        for (const doc of documentes) {
            const splits = await this.splitDocument(doc);
            // Créer des IDs uniques pour chaque chunk
            const chunkIds = splits.map((_, index) => `${doc.id}-chunk-${index}`);

            await this.chromaClient.addDocuments(splits);
        }
    }
    private async splitDocument(doc: { id: string; content: string; title: string; }) {
        const splits = await this.textSplitter.splitDocuments([{
            pageContent: doc.content,
            metadata: {
                title: doc.title,
                id: doc.id
            }
        }]);
        console.log("nb de chunks pour le doc :", splits.length);
        console.log('visu chunks', splits.slice(0, 3));
        return splits;
    }

    async getAllDocumentsFromNotionDb(){
        const notionClient = new NotionClient(NOTION_API_KEY);
        const pagesIds = await notionClient.getPagesIdFromDatabase(NOTION_DATABASE_ID);
        console.log("🚀 ~ RAGMain ~ main ~ databaseResponse:", pagesIds);

        let allDocumentsContents = "";
        for(let i = 0; i < pagesIds.length; i++){
            console.log(i)
            allDocumentsContents += "Page num "+i+" : "
            allDocumentsContents += await notionClient.getPageContent(pagesIds[i])

        }
        console.debug("🚀 ~ RAGMain ~ main ~ page:", allDocumentsContents);
    }

    async processAllDocumentsWithPagination() {
        const notionClient = this.getNotionClient();

        //NOT GOOD
        const allDocuments = await notionClient.getPageContent("");


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



