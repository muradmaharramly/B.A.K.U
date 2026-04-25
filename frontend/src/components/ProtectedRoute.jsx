import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        background: '#0a0a0f', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#9FC73C',
        fontFamily: 'Outfit'
      }}>
        Verifying Administrative Access...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
