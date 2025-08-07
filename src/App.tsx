import './App.css'

// pages
import NewInteraction from './pages/NewInteraction';
import ViewInteraction from './pages/ViewInteraction';

// components
import Sidebar from './components/Sidebar';
import { ThemeProvider } from "@/components/theme-provider"

// hooks
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
          <div className='flex-grow sm:ml-22 overflow-hidden'>
            <Routes>
              <Route 
                path="/" 
                element={
                  React.cloneElement(<NewInteraction isSidebarOpen={isSidebarOpen}/>)
                }
              />
              <Route 
                path="/interaction/:id" 
                element={
                  React.cloneElement(<ViewInteraction isSidebarOpen={isSidebarOpen}/>)
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