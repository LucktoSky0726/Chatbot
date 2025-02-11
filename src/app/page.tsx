"use client";
import Link from 'next/link'
import Navbar from '@/component/Navbar';  
export default function Home() {
  
  return (
      <main className="flex min-h-screen flex-col items-center  px-24 py-5">
        <Navbar/>
        <section className="flex h-[50rem] w-[60rem] flex-col border-2 border-gray-600 rounded-xl p-10">
            <h2 className="text-2xl text-center">Welcome to My Page</h2>
            <div className="mt-2 p-2">This is a simple webpage using Tailwind CSS and Next.js to <b>earn competition score</b> by passing course that <b>GPT</b> made. </div>
            <div className='p-2'>
              <Link className='font-bold' href={"/chatbot"}>OpenAI</Link> is the first task and very simple
            </div>
            <div className='p-2'>
              <Link className='font-bold' href={"/langchain"}>Langchain</Link> is a Retrieval Augmented Generation APP. <br/>
              You can ask some questions like these <b>How about GPT’s skill?</b>, <b>What did GPT said?</b>
            </div>
            <div className='p-2'>
              <Link className='font-bold' href={"/pdf"}>PDF</Link> is a PDFchat bot <br/>
              You can upload a PDF and ask questions
            </div>
            <div className='p-2'>
              <Link className='font-bold' href={"/audio"}>Audio</Link> is a Whisper bot that gets transcriptions from audio files <br/>
              You can upload a Audio file and get transcriptions
            </div>
        </section>
      </main>
    );
  
}