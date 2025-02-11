"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [theInput, setTheInput] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is Lucky! How can I help you today?",
    },
  ]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      setUploadStatus("Please upload a PDF");
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
        setUploadStatus("Data added successfully");
      } else {
        setUploadStatus("Failed to add data");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file");
    }
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
    <main className="flex min-h-screen flex-col items-center px-24 py-5">
      <h1 className="text-5xl font-sans">ChatterBot</h1>
      <div className="flex  h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl mt-24">
        <div
          {...getRootProps({
            className:
              "dropzone p-4 border-b-4 border-white transition-colors duration-200 ease-in-out cursor-pointer",
          })}
        >
          <input {...getInputProps()} />
          <p>Upload a PDF to add new data</p>
        </div>
        {uploadStatus && <p className="mt-4 text-center">{uploadStatus}</p>}
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
            {isLoading ? <div className="self-start  bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">*thinking*</div> : ""}
          </div>
        </div>
        <div className="relative bottom-4 w-[80%]">
          <form onSubmit={handleSubmit}>
            <input
              className="w-[85%] h-10 px-3 py-2
          resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
              value={theInput}
              placeholder="Enter your prompt..."
              onChange={handleInputChange}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="w-[15%] bg-blue-500 px-4 py-2 rounded-r"
            >
              Submit
            </button>
            
          </form>
        </div>
        
      </div>
      
    </main>
  );
}
