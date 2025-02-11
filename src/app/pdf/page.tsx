"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is Lucky! How can I help you today?",
    },
  ]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);

    const file = acceptedFiles[0];
    const temp = messages;
    let uploadMessage = ""
    temp.push({ role: "user", content: "I've uploaded a new file" });
    setMessages(temp)
    if (file.type !== "application/pdf") {
      uploadMessage = "You should upload a PDF"
      return;
    }
    const formData = new FormData();
    formData.set("file", file);

    try {
      const response = await fetch("/api/pdf/addData", {
        method: "POST",
        body: formData,
      });

      const body = await response.json();

      if (body.success) {
        uploadMessage = `The file ${file.name} has been added successfully. Please feel free to ask any questions you have about the content in the PDF file.`
        
      } else {
        uploadMessage = "Failed to add data to the model. Please try again."
      }
    } catch (error) {
      uploadMessage = `${error}Error occurs when uploading file. Please try again`
    }
    const theResponse = {
      role:'assistant',
      content:uploadMessage,
      refusal:null
    }
    setMessages((prevMessages) => [...prevMessages, theResponse]);
    setIsLoading(false);

  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const temp = messages;
    temp.push({ role: "user", content: theInput });
		setMessages(temp)
    setTheInput("");
    console.log("Calling OpenAI...");
    
    const response = await fetch("/api/pdf/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: theInput }),
    });
    const data = await response.json();
    console.log("data=>",data)

    console.log("PDFChat replied...", data.content);

    setMessages((prevMessages) => [...prevMessages, data]);
    setIsLoading(false);
  
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-24 ">
      {/* <h1 className="text-5xl font-sans">ChatterBot</h1> */}
      <div className="flex  h-[50rem] w-[60rem] flex-col items-center bg-gray-600 rounded-xl mt-24">
        <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 w-full">
          <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
            {messages.map((e,k) => {
              return (
                <div
                  key={k}
                  className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${
                    e.role === "assistant"
                      ? "self-start  bg-gray-200 text-gray-800"
                      : "self-end  bg-gray-800 text-gray-50"
                  } `}
                >
                  {e.content}
                </div>
              );
            })}
            {isLoading ? 
            <div className="self-start w-full max-w-sm rounded-md border border-blue-300 p-4">
              <div className="flex animate-pulse space-x-4">
                <div className="size-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 rounded bg-gray-200"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                      <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                    </div>
                    <div className="h-2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
           : ""}
          </div>
        </div>
        <div className="relative bottom-4 w-[80%] ">
          <form onSubmit={handleSubmit} className="grid grid-cols-4">
            <input
              className="h-10 px-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none col-span-2"
              value={theInput}
              placeholder="Enter your prompt..."
              onChange={handleInputChange}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-500 px-4 py-2"
            >
              Submit
            </button>
            <div
              {...getRootProps({
                className:
                  "dropzone p-2 text-center bg-green-700 rounded-r transition-colors duration-200 ease-in-out cursor-pointer",
              })}
            >
              <input {...getInputProps()} />
              <p>Upload</p>
            </div>
          </form>
        </div>
        
      </div>
      
    </main>
  );
}
