import { skills } from '../data/site.js';

export default function About() {
  return (
    <section id="about" style={{ marginBottom: 88, animation: 'fadeUp .7s both' }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.3em', color: '#E8A18C', textTransform: 'uppercase' }}>00 / About</div>
      <p className="about-lead" style={{ marginTop: 22, maxWidth: 780, fontSize: 'clamp(26px,3.4vw,40px)', fontWeight: 300, lineHeight: 1.45, letterSpacing: '.005em' }}>
        我是<span style={{ fontWeight: 700 }}>杜赫倫</span>，一名專注於3D建模&amp;<span style={{ color: 'rgb(232, 161, 140)' }}>介面與軟體開發</span>的創作者。相信好的產品是把複雜變簡單，把日常變值得期待。
      </p>
      <div style={{ marginTop: 34, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {skills.map((k) => (
          <span key={k} style={{ padding: '8px 16px', border: '1px solid var(--border-2)', borderRadius: 100, fontSize: 13, letterSpacing: '.04em', color: 'var(--text-2)' }}>{k}</span>
        ))}
      </div>
    </section>
  );
}
