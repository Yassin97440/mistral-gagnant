interface DocumentProcessingParams {
    huggingfaceApiKey: string;
    mistralApiKey: string;
    notionApiKey: string;
    notionDatabaseId: string;
    supabaseApiKey: string;
    supabaseUrl: string;
    chunkSize?: number;
    chunkOverlap?: number;
}

export default DocumentProcessingParams;