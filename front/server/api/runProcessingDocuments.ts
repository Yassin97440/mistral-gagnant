import { Main } from "~~/services/Chat/Main"
import { DocumentHandler } from "@yassin97440/mistral-gagnant"
const main = new Main()

export default defineEventHandler(async (event) => {
    try {
        const docHandler = new DocumentHandler(1000,200);
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

