import fs from 'fs';
import path from 'path';

export interface ConfluenceConfig {
    baseUrl: string;
    username: string;
    apiToken: string;
}

export class ConfluenceClient {
    private baseUrl: string;
    private auth: string;

    constructor(config: ConfluenceConfig) {
        this.baseUrl = config.baseUrl;

        this.auth = this.createBasicAuth(config.username, config.apiToken);
    }

    /**
     * Crée l'en-tête d'authentification Basic compatible navigateur et serveur
     */
    private createBasicAuth(username: string, password: string): string {
        // Vérifier si on est dans un environnement navigateur ou Node.js
        if (typeof window !== 'undefined') {
            // Côté client (navigateur) - utiliser btoa()
            return btoa(`${username}:${password}`);
        } else {
            // Côté serveur (Node.js) - utiliser Buffer
            return Buffer.from(`${username}:${password}`).toString('base64');
        }
    }

    /**
     * Méthode helper pour effectuer des requêtes authentifiées
     */
    private async request<T>(endpoint: string, options: any = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await useFetch<T>(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Basic ${this.auth}`,
                'Content-Type': 'application/json',
            },
        });

        return response as T;
    }

    /**
     * Récupère une page par son ID
     */
    async getPageById(pageId: string, expand: string[] = []): Promise<any> {
        const expandQuery = expand.length > 0 ? `?expand=${expand.join(',')}` : '';
        return this.request<any>(`/rest/api/content/${pageId}${expandQuery}`);

    }

    static async getAllHtmlDocFile(): Promise<{ id: string, content: string; title: string }[]> {

        const directoryPath = path.join('~~/../../Confluence-space-export-html/DEV');
        const documents: { id: string, content: string; title: string }[] = [];

        try {
            const files = fs.readdirSync(directoryPath);

            for (const file of files) {
                if (path.extname(file) === '.html') {
                    const filePath = path.join(directoryPath, file);
                    // Lecture du contenu HTML brut
                    const content = fs.readFileSync(filePath, 'utf-8');

                    documents.push({
                        id: path.basename(file),
                        title: path.basename(file, '.html'),
                        content: content
                    });
                }
            }
            console.log("taille totale ", documents.length)
            return documents;
        } catch (error) {
            console.error('Erreur lors de la lecture des fichiers:', error);
            throw error;
        }
    }
} 