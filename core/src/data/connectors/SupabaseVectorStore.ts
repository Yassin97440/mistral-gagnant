import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { getEmbeddings } from "../../processing";
import DocumentProcessingParams from "../../types/DocumentProcessingParams";




export function getSupabaseVectorStore(tableName: string, queryName: string, credentials: DocumentProcessingParams): SupabaseVectorStore {
  return new SupabaseVectorStore(getEmbeddings(credentials), {
    client: createClient(
      credentials.supabaseUrl || "",
      credentials.supabaseApiKey || ""
    ),
    tableName: tableName,
    queryName: queryName,
  });
}