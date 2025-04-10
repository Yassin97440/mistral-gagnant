import { DocumentHandler } from "./documents/DocumentHandler";


class RAGMain {
    public static async main() {
        try {
            const docHandler = new DocumentHandler(1000,200);

            docHandler.processAllDocumentsWithPagination();

        } catch (error) {
            console.error("Erreur lors de l'exécution :", error);
        }
    }
}

// Point d'entrée du programme
if (require.main === module) {
    RAGMain.main().catch(console.error);
} 