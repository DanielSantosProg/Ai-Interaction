import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewInteraction from './pages/NewInteraction';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-row">        
        <BrowserRouter>
          <Sidebar />

          <div className='flex-grow ml-2 sm:ml-22'>
            <Routes>
              <Route path="/" element={<NewInteraction />}/>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App