import Hoverable from './Hoverable.jsx';
import { work } from '../data/site.js';

export default function Career() {
  return (
    <section id="work" className="sec-gap" style={{ marginTop: 104 }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.3em', color: '#E8A18C', textTransform: 'uppercase' }}>03 / Career</div>
      <h2 className="sec-h2" style={{ marginTop: 10, fontSize: 38, fontWeight: 900, letterSpacing: '-.01em', marginBottom: 34 }}>工作經歷</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {work.map((w, i) => (
          <Hoverable
            key={i}
            className="work-row"
            style={{ display: 'grid', gridTemplateColumns: '165px 1fr', gap: 32, padding: '20px 14px', borderTop: '1px solid var(--border)', borderRadius: 10, transition: '.3s' }}
            hoverStyle={{ background: 'var(--surface)', paddingLeft: 22 }}
          >
            <div className="work-period" style={{ fontFamily: "'Space Mono',monospace", fontSize: 12.5, color: '#7C9CB5', paddingTop: 5, letterSpacing: '.01em' }}>{w.period}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 19, fontWeight: 700 }}>{w.role}</span>
                <span style={{ fontSize: 14, color: 'var(--text-3)' }}>{w.org}</span>
                {w.loc && (
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#E8A18C', border: '1px solid rgba(232,161,140,.3)', borderRadius: 100, padding: '2px 9px' }}>{w.loc}</span>
                )}
              </div>
              {w.detail && (
                <p style={{ marginTop: 7, fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)', maxWidth: 640 }}>{w.detail}</p>
              )}
            </div>
          </Hoverable>
        ))}
      </div>
    </section>
  );
}
