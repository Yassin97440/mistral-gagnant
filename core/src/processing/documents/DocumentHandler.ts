import { NotionClient } from "../../data/connectors/NotionClient";
import { getSupabaseVectorStore } from "../../data/connectors/SupabaseVectorStore";
import { CustomJsonSplitter, DocumentChunk } from "../splitter/CustomJsonSplitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { BlockData } from "../../types/BlockData";
import  DocumentProcessingParams  from "../../types/DocumentProcessingParams";
export class DocumentHandler {
    private BATCH_SIZE = 50;
    private vectoreStore: SupabaseVectorStore;
    private chunkSize: number
    private chunkOverlap: number
    private processingParams: DocumentProcessingParams

    constructor(processingConfig: DocumentProcessingParams) {
        this.vectoreStore = getSupabaseVectorStore("documents", "store_embedded_documents", processingConfig)
        this.chunkSize = processingConfig.chunkSize || 500;
        this.chunkOverlap = processingConfig.chunkOverlap || 50;
        this.processingParams = processingConfig;
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
            if (!doc.content || doc.content.length == 0 || doc.content.trim() === 'undefined')
                continue;
            const splits = await this.splitDocument(doc);
            const chunksWithMetadata = this.addMetadataToChunk(splits, doc);

            const chunkIds = splits.map((_, index) => `${BigInt(Date.now() + index)}`);
            await this.vectoreStore.addDocuments(chunksWithMetadata, { ids: chunkIds });

            totalChunksAddedToDb += 1;
            console.warn("CHUNCKED ADDED IN SUPABASE ");
        }
        console.log("🚀 ~ DocumentHandler ~ processDocumentsBatch ~ totalChunksAddedToDb for chunck:", totalChunksAddedToDb)
    }

    async getAllDocumentsFromNotionDb(): Promise<BlockData[]> {
        const notionClient = this.getNotionClient();
        const pages = await notionClient.getPagesDataFromDatabase(this.processingParams.notionDatabaseId || "");

        let allDocumentsContents: BlockData[] = [];
        for (let i = 0; i < pages.length; i++) {

            allDocumentsContents.push(await notionClient.getPageContent(pages[i]))
            console.info("🚀 ~ DocumentHandler ~ getAllDocumentsFromNotionDb ~ allDocumentsContents: page terminé ", i)

        }
        return allDocumentsContents;
    }

    private getNotionClient() {
        if (!this.processingParams.notionApiKey) {
            throw new Error("Notion API key is not set");
        }
        return new NotionClient(this.processingParams.notionApiKey);
    }


    private async splitDocument(doc: BlockData) {

        // D'abord splitter le contenu sans métadonnées
        const splitter = new CustomJsonSplitter({ chunkSize: this.chunkSize, chunkOverlap: this.chunkOverlap });

        const jsonChunks = await splitter.splitJsonWithLangchain(doc.content);


        // Ensuite, enrichir chaque chunk avec des métadonnées spécifiques
        return jsonChunks;
    }





    private addMetadataToChunk(jsonChunks: DocumentChunk[], doc: BlockData) : DocumentChunk[] {
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
                "chunk_summary": `Partie ${index + 1}/${jsonChunks.length} de ${doc.title}`,
                "chunk_position": index === 0 ? "début" : index === jsonChunks.length - 1 ? "fin" : "milieu",
                // chunk_keywords: extractKeywords(split.pageContent)
            };
            console.log("🚀 ~ DocumentHandler ~ returnjsonChunks.map ~ split:", split);
            return split;
        });
    }
}


