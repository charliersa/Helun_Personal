import Hoverable from './Hoverable.jsx';
import { navItems } from '../data/site.js';

const LOGO = 'https://res.cloudinary.com/dbiirpmpy/image/upload/v1776602970/helun/icon/LOGO.png';

export default function Header({ theme, onToggleTheme, isAdmin, onLockAdmin }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: 'linear-gradient(180deg,var(--header-bg1),var(--header-bg2))', borderBottom: '1px solid var(--border)' }}>
      <div className="hdr-bar" style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 40px', display: 'flex', alignItems: 'center', gap: 26 }}>
        <img src={LOGO} alt="Helun logo" style={{ width: 62, height: 62, flex: '0 0 auto', borderRadius: '50%', objectFit: 'cover', background: '#fff', boxShadow: '0 0 0 1px var(--shadow-ring),0 0 0 5px rgba(232,161,140,.10)' }} />
        <div className="hdr-id" style={{ flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 23, fontWeight: 900, letterSpacing: '.04em' }}>杜赫倫</span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, letterSpacing: '.32em', textTransform: 'uppercase', color: '#E8A18C' }}>Helun</span>
          </div>
          <div style={{ marginTop: 5, fontFamily: "'Space Mono',monospace", fontSize: 10.5, letterSpacing: '.04em', color: 'var(--faint)', lineHeight: 1.6 }}>
            珍惜每一天的自己 · 成就每一天的生活<br />人生由自己去定義，不活在他人的眼中
          </div>
        </div>
        <nav className="hdr-nav" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {navItems.map((item) => (
            <Hoverable
              as="a"
              key={item.href}
              href={item.href}
              style={{ position: 'relative', padding: '10px 18px', fontSize: 15, fontWeight: 500, letterSpacing: '.06em', color: 'var(--text-2)', textDecoration: 'none', borderRadius: 10, transition: '.25s' }}
              hoverStyle={{ color: 'var(--text)', background: 'var(--surface-2)' }}
            >
              {item.label}
            </Hoverable>
          ))}
          <Hoverable
            as="button"
            onClick={onToggleTheme}
            aria-label="切換深淺主題"
            style={{ all: 'unset', cursor: 'pointer', marginLeft: 8, width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid var(--border-2)', color: 'var(--text)', fontSize: 16, transition: '.25s' }}
            hoverStyle={{ background: 'var(--surface-2)', borderColor: '#E8A18C', color: '#E8A18C' }}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </Hoverable>
          {isAdmin && (
            <Hoverable
              as="button"
              onClick={onLockAdmin}
              title="登出管理模式"
              style={{ all: 'unset', cursor: 'pointer', marginLeft: 6, padding: '0 14px', height: 42, display: 'grid', placeItems: 'center', borderRadius: 100, border: '1px solid var(--accent)', color: 'var(--accent)', fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.06em', transition: '.25s' }}
              hoverStyle={{ background: 'var(--accent)', color: '#0B0B0D' }}
            >
              管理中 · 登出
            </Hoverable>
          )}
        </nav>
      </div>
    </header>
  );
}
