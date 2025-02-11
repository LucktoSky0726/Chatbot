import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

export async function POST(request: NextRequest) {
  try {
    // Parse the POST request's JSON body
    const body = await request.json();

    // Initialize Pinecone Client
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);

    // Initialize our vector store
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    );

    // Specify the OpenAI model we'd like to use, and turn on streaming
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      streaming: true,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Define the Langchain chain
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: true,
        memory: new BufferMemory({
          memoryKey: "chat_history",
          inputKey: "question",
          outputKey: "text",
        }),
      }
    );

    // Get a streaming response from our chain with the prompt given by the user
    const stream = await chain.stream({ question: body.prompt });
    console.log(stream);

    const jsonArray = [];
    for await (const chunk of stream) {
      jsonArray.push(chunk);
    }
    // console.log("jsonArray[0].text=>", jsonArray[0].text);
    const theResponse = {
      role:'assistant',
      content:jsonArray[0].text,
      refusal:null
    }
    return NextResponse.json(theResponse);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
