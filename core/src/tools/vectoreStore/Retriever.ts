import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChromaAdapter } from "../../data/connectors/ChromaAdapter";
import { getEmbeddings } from "../../processing/embedding/HFSentence-transformers";

const retrieveSchema = z.object({ query: z.string() });
let vectorStore: ChromaAdapter;

const initVectorStore = async () => {
  vectorStore = await ChromaAdapter.fromExistingCollection(getEmbeddings(), {
    collectionName: "rag-0.1",
  });
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