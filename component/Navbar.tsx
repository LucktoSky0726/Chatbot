// components/Navbar.js  

import Link from 'next/link';  

const Navbar = () => {  
  return (  
    <nav className="p-4">  
      <div className="container mx-auto flex justify-between items-center ">  
        <div className="md:flex space-x-4">  
          <Link href="/" className="hover:bg-blue-700 rounded px-3 py-2">  
            Home  
          </Link>
           
          <Link href="/langchain" className="hover:bg-blue-700 rounded px-3 py-2">  
          Langchain  
          </Link>
          <Link href="/pdf" className="hover:bg-blue-700 rounded px-3 py-2">  
          PDF  
          </Link>  
          <Link href="/chatbot" className="hover:bg-blue-700 rounded px-3 py-2">  
          Openai  
          </Link> 
          <Link href="/audio" className="hover:bg-blue-700 rounded px-3 py-2">  
          Audio  
          </Link>  
            
        </div>  
        
      </div>  
    </nav>  
  );  
};  

export default Navbar;