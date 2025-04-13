import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export interface DocumentChunk {
  pageContent: string;
  metadata: {
    [key: string]: any; 
  };
}

interface JsonSplitterOptions {
  chunkSize?: number; // en nombre de caractères
  chunkOverlap?: number; // en nombre de caractères
}

export class CustomJsonSplitter {
  private chunkSize: number;
  private chunkOverlap: number;

  constructor(options?: JsonSplitterOptions) {
    this.chunkSize = options?.chunkSize ?? 1000;
    this.chunkOverlap = options?.chunkOverlap ?? 200;
  }

  async splitJsonWithLangchain(
    jsonData: any,
    metadata: Record<string, any> = {},
  ): Promise<DocumentChunk[]> {
    // Étape 1 : transformer le JSON en texte lisible
    const rawText = this.flattenJson(jsonData);
  
    // Étape 2 : split via LangChain
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
      separators: ["\n\n", "\n", "."], // découpage intelligent
    });
  
    const docs = await splitter.createDocuments([rawText]);
  
    // Étape 3 : enrichir avec les métadonnées
    return docs.map((doc, index) => ({
      pageContent: doc.pageContent,
      metadata: {
        ...metadata,
        chunk_index: index,
        chunk_total: docs.length,
        chunk_summary: `Partie ${index + 1}/${docs.length} de ${metadata?.title ?? 'document'}`,
        chunk_position: index === 0 ? "début" : index === docs.length - 1 ? "fin" : "milieu",
      },
    }));
  }

  private flattenJson(data: any): string {
    // Transforme l’objet JSON en texte lisible, ligne par ligne clé: valeur
    if (Array.isArray(data)) {
      return data.map((item, idx) => `### Item ${idx + 1}\n${this.flattenJson(item)}`).join("\n\n");
    } else if (typeof data === "object" && data !== null) {
      return Object.entries(data)
        .map(([key, value]) => {
          if (typeof value === "object") {
            return `${key}:\n${this.flattenJson(value)}`;
          }
          return `${key}: ${value}`;
        })
        .join("\n");
    }
    return String(data);
  }

  private chunkText(text: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);
      const chunkContent = text.slice(start, end);
      chunks.push({ pageContent: chunkContent.trim(), metadata: {} });
      start += this.chunkSize - this.chunkOverlap;
    }

    return chunks;
  }
}
