import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewInteraction from './pages/NewInteraction';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="min-h-screen flex-row">
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className='ml-2 sm:ml-22'>
            <Routes>
              <Route path="/" element={<NewInteraction />}/>
            </Routes>
          </div>          
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
