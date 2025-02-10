import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";   // Importing required modules  
import "cheerio";  
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";  
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";  
import { MemoryVectorStore } from "langchain/vectorstores/memory";  
import { OpenAIEmbeddings } from "@langchain/openai";  
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {
    const body = await req.json()
    const messages = body.messages
    const message = messages[messages.length-1].content
    const llm = new ChatOpenAI({  
      model: "gpt-4o-mini",  
      apiKey: process.env.OPENAI_KEY // Store your API key securely  
    });  

    // Initialize embeddings with a model that supports embeddings  
    const embeddings = new OpenAIEmbeddings({  
        model: "text-embedding-ada-002", // Model that supports embeddings  
        apiKey: process.env.OPENAI_KEY  
    });  

    const vectorStore = new MemoryVectorStore(embeddings);  

    // Load and chunk contents of the blog  
    const pTagSelector = "p";  
    const cheerioLoader = new CheerioWebBaseLoader(  
        "https://chatbot-azure-zeta.vercel.app/story",  
        { selector: pTagSelector }  
    );  

    const docs = await cheerioLoader.load();  
    
    const splitter = new RecursiveCharacterTextSplitter({  
        chunkSize: 1000,  
        chunkOverlap: 200  
    });  
    const allSplits = await splitter.splitDocuments(docs);  

    // Index chunks  
    await vectorStore.addDocuments(allSplits);  

    // Define a prompt for question-answering  
    // const promptTemplate = await pull("rlm/rag-prompt");
    const template = `Use the following pieces of context to answer the question
    If your previous knowledge contradictory to the context, shouldn't use your previous knowledge.
    If you can't find the answer in the context, use your previous knowledge to answer.
    Shouldn't provide unnecessary phrase and such as "In the context provided, it seems to be incorrectly described" or "described as".
      Keep the answer as concise as possible and it looks like more natural.
    {context}

    Question: {question}

    Helpful Answer:`;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["user", template],
    ]);

    // Define functions for retrieval and generation  
    const retrieve = async (question:string) => {  
        const retrievedDocs = await vectorStore.similaritySearch(question);  

        // Return the retrieved documents' content  
        return retrievedDocs.map(doc => doc.pageContent).join("\n");  
    };  

    const generate = async (question:string, context:string) => {  
        const messages = await promptTemplate.invoke({ question, context });  
        const response = await llm.invoke(messages);  
        return response.content;  
    };  

    // Compile application and test  
    const context = await retrieve(message);
    const answer = await generate(message, context);  
    console.log(answer)
    const theResponse = {
      role:'assistant',
      content:answer,
      refusal:null
    }
  
    return NextResponse.json({ output: theResponse }, { status: 200 })
  
  };
export async function GET() {
  // const body = await req.json()
  return NextResponse.json({result:"ok"})
  
}