import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import {OpenAIEmbeddings} from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone";

export async function POST(request: NextRequest) {
  // Extract FormData from the request
  const data = await request.formData();
  // Extract the uploaded file from the FormData
  const file: File | null = data.get("file") as unknown as File;

  // Make sure file exists
  if (!file) {
    return NextResponse.json({ success: false, error: "No file found" });
  }

  // Make sure file is a PDF
  if (file.type !== "application/pdf") {
    return NextResponse.json({ success: false, error: "Invalid file type" });
  }

  // Use the PDFLoader to load the PDF and split it into smaller documents
  const pdfLoader = new PDFLoader(file);
  const splitDocuments = await pdfLoader.load();
  
  // Initialize the Pinecone client. It automatically reads the PINECONE_API_KEY variable from the environment
  const pinecone = new Pinecone({apiKey: process.env.PINECONE_API_KEY as string});
  
  const pineconeIndex = pinecone.Index(
      process.env.PINECONE_INDEX_NAME as string
    );
    
    console.log('--- success ---')
    // Use Langchain's integration with Pinecone to store the documents
    await PineconeStore.fromDocuments(splitDocuments, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}), {
        pineconeIndex,
    });
    console.log('--- completely success ---')

  return NextResponse.json({ success: true });
}