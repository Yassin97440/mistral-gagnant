interface JsonChunk {
    pageContent: string;
    metadata: Record<string, any> ;
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
  
    split(jsonData: any): JsonChunk[] {
      const rawText = this.flattenJson(jsonData);
      return this.chunkText(rawText);
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
  
    private chunkText(text: string): JsonChunk[] {
      const chunks: JsonChunk[] = [];
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
  