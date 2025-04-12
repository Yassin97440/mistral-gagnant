import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { createChromaClient } from "../../data/connectors/ChromaHandler";

const retrieveSchema = z.object({ query: z.string() });
const vectorStore = createChromaClient("rag-0.1");

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