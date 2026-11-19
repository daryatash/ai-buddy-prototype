import { ChatPanel } from '../components/ChatPanel';
import { ChecklistPanel } from '../components/ChecklistPanel';
import { Header } from '../components/Header';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.body}>
        <div className={styles.chatColumn}>
          <ChatPanel />
        </div>
        <div className={styles.checklistColumn}>
          <ChecklistPanel />
        </div>
      </div>
    </div>
  );
}