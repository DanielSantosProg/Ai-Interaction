import './App.css';

// Libraries/Hooks
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useContext, Suspense } from 'react';
import React from 'react';
import { AuthContext } from "./context/AuthContext";

// Components
import Sidebar from './components/Sidebar';
import { ThemeProvider } from "@/components/theme-provider";
import { Loader2Icon } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
const NewInteraction = React.lazy(() => import('./pages/NewInteractionTest'));
import Home from './pages/Home';
import ViewInteraction from './pages/ViewInteraction';
import Config from './pages/Config';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const { user, login, logout, loading: authLoading } = useContext(AuthContext); // Pega o estado de loading do contexto

  const handleSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-row overflow-hidden">
        <BrowserRouter>
          <Sidebar handleSidebarOpen={handleSidebarOpen} isSidebarOpen={isSidebarOpen} user={user} login={login} logout={logout} />
          <div className='flex-grow sm:ml-22 overflow-hidden'>
            {authLoading ? (
              <div className='flex h-screen justify-center items-center'>
                <Loader2Icon className="animate-spin mr-2" size={20} />
                Carregando...
              </div>
            ) : (
              <Suspense fallback={<div className='flex h-screen justify-center items-center'>
                <Loader2Icon className="animate-spin mr-2" size={20} />
                Carregando...
              </div>}>
                <Routes>
                  {/* Rota pública */}
                  <Route
                    path="/"
                    element={<Home isSidebarOpen={isSidebarOpen} isHistoryOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} login={login} logout={logout} />}
                  />

                  {/* Rotas protegidas */}
                  <Route element={<ProtectedRoute />}>
                    <Route
                      path="/new-interaction"
                      element={React.cloneElement(<NewInteraction isSidebarOpen={isSidebarOpen} isHistoryOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />)}
                    />
                    <Route
                      path="/interaction/:id"
                      element={React.cloneElement(<ViewInteraction isSidebarOpen={isSidebarOpen} isHistoryOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />)}
                    />
                    <Route
                      path="/config"
                      element={<Config isSidebarOpen={isSidebarOpen} isHistoryOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />}
                    />
                  </Route>
                </Routes>
              </Suspense>
            )}
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;