import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { api } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatWhen } from '../../utils.js';
import ui from '../../styles/ui.module.css';
import styles from './Support.module.css';

const FAQ = [
  { q: 'What are Gems?', a: 'Gems are reward credits earned through eligible activities on VELOOP Rewards.' },
  { q: 'What are VEs?', a: "VEs are VELOOP Rewards' virtual reward currency. You can use them for eligible rewards under platform rules." },
  { q: 'How do I convert Gems into VEs?', a: 'Open Exchange Center, choose a conversion, review it and confirm. Your balances update right away.' },
  { q: 'Can a conversion be repeated by accident?', a: 'No. Each conversion is sent once and protected from duplicates, so double-clicking will not convert twice.' },
  { q: 'Why is a conversion locked?', a: 'You need enough Gems for it. The card shows how many more you need, and Level Up & Earn shows ways to get them.' },
];

export default function Support() {
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => { api.get('/support/tickets').then((d) => setTickets(d.tickets)).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const { ticket } = await api.post('/support/tickets', form);
      setTickets((list) => [ticket, ...list]);
      setForm({ subject: '', message: '' });
      toast.success('Message sent. We will get back to you.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={ui.stack}>
      <PageHeader title="Support" subtitle="Answers and help when you need it." />
      <div className={ui.grid2}>
        <section className={ui.panel} aria-labelledby="faq-heading">
          <div className={ui.panelHead}><h2 id="faq-heading" className={ui.panelTitle}>Common questions</h2></div>
          <div className={styles.faq}>
            {FAQ.map((item) => (
              <details key={item.q} className={styles.item}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className={ui.stack}>
          <section className={ui.panel} aria-labelledby="contact-heading">
            <div className={ui.panelHead}><h2 id="contact-heading" className={ui.panelTitle}>Contact us</h2></div>
            <form className={styles.form} onSubmit={submit}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="subject">Subject</label>
                <input id="subject" className={ui.input} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="What do you need help with?" required minLength={3} />
              </div>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="message">Message</label>
                <textarea id="message" className={ui.input} rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tell us more" required minLength={10} />
              </div>
              <button type="submit" className={`${ui.btn} ${ui.btnGold}`} disabled={sending}>
                {sending ? <><Loader2 size={16} className="spin" aria-hidden="true" /> Sending...</> : 'Send message'}
              </button>
            </form>
          </section>

          {tickets.length > 0 && (
            <section className={ui.panel} aria-labelledby="tickets-heading">
              <div className={ui.panelHead}><h2 id="tickets-heading" className={ui.panelTitle}>Your messages</h2></div>
              <ul className={styles.tickets}>
                {tickets.map((t) => (
                  <li key={t.id}><div><p>{t.subject}</p><time dateTime={t.createdAt}>{formatWhen(t.createdAt)}</time></div><span className={ui.pill} data-status="open">Open</span></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
