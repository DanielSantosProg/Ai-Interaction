import './App.css'

// Libraries/Hooks
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import React, { Suspense } from 'react';

// pages
const NewInteraction = React.lazy(() => import('./pages/NewInteraction'));
import Home from './pages/Home';
import ViewInteraction from './pages/ViewInteraction';

// components
import Sidebar from './components/Sidebar';
import { ThemeProvider } from "@/components/theme-provider"
import { Loader2Icon } from 'lucide-react';
import Config from './pages/Config';

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
            <Suspense fallback={<div className='flex h-screen justify-center items-center'>                    
                      <Loader2Icon className="animate-spin mr-2" size={20} />
                      Carregando...
                    </div>}>
              <Routes>
                <Route 
                  path="/" 
                  element={<Home isSidebarOpen={isSidebarOpen}/>}
                />
                <Route 
                  path="/new-interaction" 
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
                <Route path="/config" element={<Config isSidebarOpen={isSidebarOpen} />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App