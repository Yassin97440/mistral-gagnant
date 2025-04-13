import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { VectorStore } from "@langchain/core/vectorstores";
import { getSupabaseVectorStore } from "../../data/connectors/SupabaseVectoreStore";

const retrieveSchema = z.object({ query: z.string() });
let vectorStore: VectorStore;

const initVectorStore = async () => {
  vectorStore = getSupabaseVectorStore("documents", "documents");
};

void initVectorStore();

const retrieve = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);

    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");

    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve information related to a query.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

export default retrieve;