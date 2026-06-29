import Hoverable from './Hoverable.jsx';
import { learn } from '../data/site.js';

export default function Learning() {
  return (
    <section id="learn" className="sec-gap" style={{ marginTop: 104 }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.3em', color: '#E8A18C', textTransform: 'uppercase' }}>04 / Learning</div>
      <h2 className="sec-h2" style={{ marginTop: 10, fontSize: 38, fontWeight: 900, letterSpacing: '-.01em', marginBottom: 34 }}>學習歷程</h2>
      <div className="learn-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {learn.map((l, i) => (
          <Hoverable
            key={i}
            style={{ padding: 26, border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', transition: '.3s' }}
            hoverStyle={{ borderColor: 'rgba(232,161,140,.4)', transform: 'translateY(-4px)' }}
          >
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#7C9CB5' }}>{l.year}</div>
            <div style={{ marginTop: 14, fontSize: 18, fontWeight: 700 }}>{l.title}</div>
            <div style={{ marginTop: 6, fontSize: 14, color: 'var(--text-3)' }}>{l.place}</div>
            <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)' }}>{l.detail}</p>
          </Hoverable>
        ))}
      </div>
    </section>
  );
}
