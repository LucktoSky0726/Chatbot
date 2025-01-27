"use client";
import { useState } from "react";
import Link from 'next/link'
export default function Home() {
  
  return (
      <main className="flex min-h-screen flex-col items-center justify-around px-24 py-5">
        <section className="bg-white shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-xl ">Welcome to My Page</h2>
            <p className="mt-2 text-gray-700">This is a simple responsive webpage using Tailwind CSS. Resize the window to see the responsiveness in action!</p>
            <Link href={`/chatbot`}>chatbot with openai</Link><br/>
            <Link href={`/audio`}>audio</Link><br/>
            <Link href={`/story`}>story</Link>
        </section>
      </main>
    );
  
}