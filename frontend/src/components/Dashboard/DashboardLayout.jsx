import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from '../../pages/Dashboard.module.scss';

export default function DashboardLayout({ children, title }) {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Topbar title={title} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
