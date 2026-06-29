import Hoverable from './Hoverable.jsx';
import { socials } from '../data/site.js';

export default function Footer() {
  return (
    <footer style={{ marginTop: 120, padding: '48px 0 56px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '.04em' }}>
          杜赫倫 <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 400, letterSpacing: '.3em', color: '#E8A18C' }}>HELUN</span>
        </div>
        <div style={{ marginTop: 8, fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--faint-2)', letterSpacing: '.04em' }}>人生由自己去定義，不活在他人的眼中</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {socials.map((s) => (
          <Hoverable
            as="a"
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener"
            style={{ padding: '11px 20px', border: '1px solid var(--border-2)', borderRadius: 100, fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.1em', color: 'var(--text-2)', textDecoration: 'none', transition: '.25s' }}
            hoverStyle={{ background: '#E8A18C', color: '#0B0B0D', borderColor: '#E8A18C' }}
          >
            {s.label}
          </Hoverable>
        ))}
      </div>
    </footer>
  );
}
