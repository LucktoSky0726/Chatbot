"use client";
import { useState } from "react";
import Navbar from '@/component/Navbar';  

export default function Home() {
  const [theFile, setTheFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    setTheFile(file);
  };

  const callGetTranscription = async () => {
      setIsLoading(true);

      if (!theFile) {
        // Handle the case when no file is selected
        setIsLoading(false);
        return;
      }
    

    const formData = new FormData();
    formData.set("file", theFile);

    
    try {
      const response = await fetch("/api/audio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle the success response
        console.log("File uploaded successfully");
      } else {
        // Handle the error response
        console.error("Failed to upload file");
      }

      const data = await response.json();

      setResponse(data.output.text);
    } catch (error) {
      // Handle any errors
      console.error("An error occurred while uploading the file", error);
    }
    setTheFile(null);
    setIsLoading(false);  
  }
  return (
      <main className="flex min-h-screen flex-col items-center justify-around px-24 py-5">
        <Navbar/>

        <div className="flex  h-[50rem] w-[60rem]  flex-col items-center bg-gray-600 rounded-xl">
          <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
            <input type="file" accept=".wav, .mp3" onChange={handleFileChange} />

            <div className="w-[90%] h-max border-2 break-words">
              {isLoading ? "Loading..." : response ? response : ""}
            </div>
          </div>
          <div className="relative  w-[80%] bottom-4 flex justify-center">
            <button
              onClick={callGetTranscription}
              className="w-max bg-blue-500 px-4 py-2 rounded-sm "
            >
              Upload
            </button>
          </div>
        </div>
      </main>
    );
  
}