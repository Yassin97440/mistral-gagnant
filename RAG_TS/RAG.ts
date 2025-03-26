import { RAGUtils } from "./RAGUtils";

class RAGMain {
    public static async main() {
        try {
            const rag = new RAGUtils();
            const llm = rag.getLlm();
            // Ajoutez ici vos tests et exécutions
            console.log("Test démarré avec succès");
        } catch (error) {
            console.error("Erreur lors de l'exécution :", error);
        }
    }
}

// Point d'entrée du programme
if (require.main === module) {
    RAGMain.main().catch(console.error);
} 