import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiUser, FiArrowRight, FiShield } from 'react-icons/fi';
import styles from './Login.module.scss';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.glowBg}></div>
      
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoBox}>
            <FiShield />
          </div>
          <h1>B.A.K.U</h1>
          <p>Administrativ Giriş Qapısı</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <FiUser className={styles.icon} />
            <input 
              type="text" 
              placeholder="İstifadəçi adı" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FiLock className={styles.icon} />
            <input 
              type="password" 
              placeholder="Təhlükəsizlik Açarı" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Avtorizasiya edilir...' : 'Girişi Təsdiqlə'}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <span>BAKU OS v1.0.4 tərəfindən qorunur</span>
        </div>
      </div>
    </div>
  );
}
