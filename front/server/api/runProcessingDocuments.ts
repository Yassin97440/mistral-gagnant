import { Main } from "~~/services/Chat/Main"
import { DocumentHandler } from "@yassin97440/mistral-gagnant"
import DocumentProcessingParams from "../../../core/dist/types/DocumentProcessingParams";
const main = Main.getInstance()

export default defineEventHandler(async (event) => {
    try {
        const credentials: DocumentProcessingParams = await readBody(event);
        const docHandler = new DocumentHandler(credentials);
        const results = await docHandler.processAllDocumentsWithPagination();
        console.log("Documents processed!!")
        return "success"
    } catch (error) {
        console.error("Error processing documents:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Error processing documents"
        });
    }
});

