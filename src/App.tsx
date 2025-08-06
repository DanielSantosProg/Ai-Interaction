import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewInteraction from './pages/NewInteraction';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from "@/components/theme-provider"
import { useState } from 'react';
import React from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-row overflow-hidden">        
        <BrowserRouter>
          <Sidebar handleSidebarOpen={handleSidebarOpen} isSidebarOpen={isSidebarOpen}/>
          <div className='flex-grow ml-2 sm:ml-22 overflow-hidden'>
            <Routes>
              <Route 
                path="/" 
                element={
                  React.cloneElement(<NewInteraction isSidebarOpen={isSidebarOpen}/>)
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App