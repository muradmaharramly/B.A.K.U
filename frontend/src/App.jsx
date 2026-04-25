import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Analytics from './pages/Analytics';
import Logs from './pages/Logs';
import Nodes from './pages/Nodes';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ fontFamily: 'Inter, sans-serif' }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/fleet" element={<Fleet />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/logs" element={<Logs />} />
        <Route path="/dashboard/nodes" element={<Nodes />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
