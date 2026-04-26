import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        background: '#050810', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#white',
        fontFamily: 'Montserrat, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid rgba(159, 199, 60, 0.1)', 
          borderTopColor: '#9FC73C', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Admin Girişi Yoxlanılır...</h2>
        <p style={{ color: '#627d98', fontSize: '0.9rem', marginBottom: '30px' }}>Bu bir neçə saniyə çəkə bilər.</p>
        
        <button 
          onClick={() => { window.location.href = '/login'; localStorage.removeItem('token'); }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          İptal et və Geri Qayıt
        </button>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
