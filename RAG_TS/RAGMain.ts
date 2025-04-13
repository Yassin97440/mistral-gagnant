import { DocumentHandler } from '@yassin97440/mistral-gagnant';
import dotenv from 'dotenv';

class RAGMain {
    public static async main() {
        try {
            dotenv.config();
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