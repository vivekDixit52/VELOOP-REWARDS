import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, Users } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Gem from '../../components/common/Gem.jsx';
import ExchangeLoader from '../../components/exchange/ExchangeLoader.jsx';
import ExchangeErrorState from '../../components/exchange/ExchangeErrorState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../api/client.js';
import { formatRemaining } from '../../utils.js';
import ui from '../../styles/ui.module.css';
import styles from './LevelUp.module.css';

const TONES = ['purple', 'blue', 'green', 'orange'];

export default function LevelUp() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/earn/tasks');
  const [tasks, setTasks] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [watching, setWatching] = useState({}); // taskId -> seconds left
  const [claiming, setClaiming] = useState(null);

  useEffect(() => { if (data) setTasks(data.tasks); }, [data]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

  const claim = async (task) => {
    if (claiming) return;
    setClaiming(task.id);
    try {
      const result = await api.post('/earn/claim', { taskId: task.id });
      setUser(result.user);
      setTasks((list) => list.map((t) => (t.id === task.id ? result.task : t)));
      toast.success(`+${task.gems} Gems added`);
      if (result.leveledUp) toast.success(`Level up! You are now level ${result.user.level}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setClaiming(null);
    }
  };

  const start = (task) => {
    if (!task.durationSec) { claim(task); return; }
    setWatching((w) => ({ ...w, [task.id]: task.durationSec }));
    const timer = setInterval(() => {
      setWatching((w) => {
        const left = (w[task.id] ?? 0) - 1;
        if (left > 0) return { ...w, [task.id]: left };
        clearInterval(timer);
        claim(task);
        const { [task.id]: _done, ...rest } = w;
        return rest;
      });
    }, 1000);
  };

  if (loading || !tasks) return error ? <ExchangeErrorState onRetry={reload} /> : <ExchangeLoader label="Loading your tasks..." />;

  const span = user.nextLevelXp - user.levelStartXp;
  const into = user.xp - user.levelStartXp;
  const progress = Math.round((into / span) * 100);

  return (
    <div className={ui.stack}>
      <PageHeader title="Level Up & Earn" subtitle="Complete tasks to earn Gems and level up." />

      <section className={styles.level}>
        <div className={styles.badge}><span>Level</span><strong>{user.level}</strong></div>
        <div className={styles.levelInfo}>
          <div className={styles.levelRow}><span>{into} / {span} XP</span><span>Next: Level {user.level + 1}</span></div>
          <div className={ui.progress} role="progressbar" aria-label="Level progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
        </div>
        <Gem tone="purple" size={150} className={styles.levelGem} />
      </section>

      <div className={styles.grid}>
        {tasks.map((task, index) => {
          const remaining = task.nextAvailableAt ? formatRemaining(task.nextAvailableAt, now) : null;
          const available = task.available || (task.nextAvailableAt && !remaining);
          const secondsLeft = watching[task.id];
          return (
            <article key={task.id} className={styles.task}>
              <Gem tone={TONES[index % 4]} size={96} className={styles.taskGem} />
              <div className={styles.taskBody}>
                <h3>{task.title}</h3>
                <p>{task.text}</p>
                <p className={styles.reward}>+{task.gems} Gems · +{task.xp} XP</p>
              </div>
              {task.completed ? (
                <span className={styles.done}><CheckCircle2 size={16} aria-hidden="true" /> Completed</span>
              ) : available ? (
                <button type="button" className={`${ui.btn} ${ui.btnGold} ${ui.btnSm}`} disabled={Boolean(claiming) || secondsLeft !== undefined} onClick={() => start(task)}>
                  {claiming === task.id ? <Loader2 size={15} className="spin" aria-hidden="true" /> : secondsLeft !== undefined ? `Watching... ${secondsLeft}s` : task.durationSec ? 'Watch & earn' : 'Claim'}
                </button>
              ) : (
                <span className={styles.wait}><Clock size={15} aria-hidden="true" /> {remaining ? `In ${remaining}` : 'Unavailable'}</span>
              )}
            </article>
          );
        })}
        <article className={styles.task}>
          <span className={styles.inviteIcon}><Users size={30} aria-hidden="true" /></span>
          <div className={styles.taskBody}><h3>Invite a friend</h3><p>Earn when they join.</p><p className={styles.reward}>+25 Gems each</p></div>
          <Link to="/referrals" className={`${ui.btn} ${ui.btnViolet} ${ui.btnSm}`}>Invite</Link>
        </article>
      </div>
    </div>
  );
}
