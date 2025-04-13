import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { getEmbeddings } from "../../processing";



export const supabaseClient = createClient(
  process.env.SUPABASE_URL || "" ,
  process.env.SUPABASE_PRIVATE_KEY || ""
);

export function getSupabaseVectorStore(tableName: string, queryName: string) : SupabaseVectorStore {
  return new SupabaseVectorStore(getEmbeddings(), {
    client: supabaseClient,
    tableName: tableName,
    queryName: queryName,
  });
}