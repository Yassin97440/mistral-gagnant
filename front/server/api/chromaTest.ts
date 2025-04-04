import { DocumentHandler } from "~~/services/RAG/DocumentHandler"

const documentHandler = new DocumentHandler()
export default defineEventHandler(async (event) => {
    console.log("ca va commencer! incroyable")
    documentHandler.processAllDocumentsWithPagination()
    console.log("storing terminé! incroyable")

})