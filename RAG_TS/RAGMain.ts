import { NotionClient } from "./documents/NotionClient";
import { NOTION_API_KEY } from "./varEnv";

class RAGMain {
    public static async main() {
        try {
            const notionClient = new NotionClient(NOTION_API_KEY)

            const pagesIds = await notionClient.getPagesIdFromDatabase( "1c9f18f45a0180ba93effe081372a2cd")
            console.log("🚀 ~ RAGMain ~ main ~ databaseResponse:", pagesIds)

            const res = await notionClient.getPageContent(pagesIds[2])
            console.debug("🚀 ~ RAGMain ~ main ~ page:", res)




            // const rag = new RAGUtils();
            // const llm = rag.getLlm();
            // // Ajoutez ici vos tests et exécutions
            // console.log("Test démarré avec succès");
            // rag.createChromaClient();
            // rag.loadingDocuments();
        } catch (error) {
            console.error("Erreur lors de l'exécution :", error);
        }
    }
}

// Point d'entrée du programme
if (require.main === module) {
    RAGMain.main().catch(console.error);
} 