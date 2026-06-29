import { useState } from 'react';
import Hoverable from './Hoverable.jsx';
import { rawPrograms, catMeta, GH } from '../data/site.js';

const pad2 = (n) => String(n).padStart(2, '0');

const STORE_KEY = 'helun-programs-v1';

// Language → dot colour (matches the colours used in the built-in list).
const STACK_DOT = {
  HTML: '#E34C26',
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
  CSS: '#563D7C',
  Python: '#3572A5',
  React: '#61DAFB',
};

function loadCustom() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function persistCustom(list) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {}
}

const EMPTY_FORM = { name: '', desc: '', stack: 'HTML', cat: 'web', status: 'Public', url: '' };

export default function ProgramList() {
  const [cat, setCat] = useState('all');
  const [custom, setCustom] = useState(loadCustom);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // Built-in programs + user-added ones (the latter flagged so they get a ✕).
  const allPrograms = [
    ...rawPrograms,
    ...custom.map((p) => ({ ...p, _custom: true })),
  ];

  const filtered = allPrograms.filter((p) => cat === 'all' || p.cat === cat);
  const webCount = allPrograms.filter((p) => p.cat === 'web').length;
  const appCount = allPrograms.filter((p) => p.cat === 'app').length;

  const tabs = [
    { key: 'all', label: '全部', count: allPrograms.length },
    { key: 'web', label: '網頁端', count: webCount },
    { key: 'app', label: '軟體端', count: appCount },
  ];

  const openProgram = (url) => {
    if (!url) return;
    const href = /^https?:/.test(url) ? url : GH + url;
    window.open(href, '_blank', 'noopener');
  };

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitProgram = () => {
    const name = form.name.trim();
    if (!name) return;
    const entry = {
      id: 'c' + Date.now(),
      name,
      desc: form.desc.trim(),
      stack: form.stack.trim() || 'HTML',
      cat: form.cat,
      status: form.status,
      dot: STACK_DOT[form.stack.trim()] || '#9A9AA2',
      url: form.url.trim(),
    };
    setCustom((prev) => {
      const next = [...prev, entry];
      persistCustom(next);
      return next;
    });
    setForm(EMPTY_FORM);
    setAdding(false);
  };

  const removeProgram = (id) => {
    setCustom((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistCustom(next);
      return next;
    });
  };

  const inputStyle = {
    padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-2)',
    background: 'var(--surface)', color: 'var(--text)', fontSize: 14,
    fontFamily: "'Noto Sans TC',sans-serif", outline: 'none',
  };

  return (
    <section style={{ animation: 'fadeUp .7s both' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 30 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.3em', color: '#E8A18C', textTransform: 'uppercase' }}>01 / Index</div>
          <h1 className="sec-h1" style={{ marginTop: 10, fontSize: 42, fontWeight: 900, letterSpacing: '-.01em', lineHeight: 1.05 }}>開發軟體程式清單</h1>
        </div>
        <Hoverable
          as="a"
          href="https://github.com/charliersa?tab=repositories"
          target="_blank"
          rel="noopener"
          style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: 'var(--faint-2)', textAlign: 'right', lineHeight: 1.7, paddingBottom: 6, textDecoration: 'none', transition: '.25s' }}
          hoverStyle={{ color: '#E8A18C' }}
        >
          {filtered.length} PROJECTS<br />@charliersa ↗
        </Hoverable>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map((t) => {
          const on = cat === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setCat(t.key)}
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 100, border: `1px solid ${on ? 'var(--chip-on-bg)' : 'var(--border-2)'}`, background: on ? 'var(--chip-on-bg)' : 'var(--surface)', color: on ? 'var(--chip-on-text)' : 'var(--text-2)', fontSize: 13.5, fontWeight: 500, letterSpacing: '.04em', transition: '.25s' }}
            >
              {t.label}
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, opacity: 0.7 }}>{pad2(t.count)}</span>
            </button>
          );
        })}
        <Hoverable
          as="button"
          onClick={() => setAdding((v) => !v)}
          style={{ all: 'unset', cursor: 'pointer', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100, border: '1px solid var(--border-2)', color: 'var(--text-2)', fontSize: 13.5, fontWeight: 500, letterSpacing: '.04em', transition: '.25s' }}
          hoverStyle={{ background: 'var(--surface-2)', color: 'var(--text)', borderColor: '#E8A18C' }}
        >
          {adding ? '✕ 取消' : '＋ 新增程式'}
        </Hoverable>
      </div>

      {adding && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 24, padding: 18, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)' }}>
          <Hoverable as="input" type="text" placeholder="名稱（必填）" value={form.name} onChange={setField('name')} onKeyDown={(e) => e.key === 'Enter' && submitProgram()} style={inputStyle} focusStyle={{ borderColor: 'var(--accent)' }} />
          <Hoverable as="input" type="text" placeholder="說明 / repo 名" value={form.desc} onChange={setField('desc')} onKeyDown={(e) => e.key === 'Enter' && submitProgram()} style={inputStyle} focusStyle={{ borderColor: 'var(--accent)' }} />
          <input list="stack-options" type="text" placeholder="技術（如 HTML）" value={form.stack} onChange={setField('stack')} style={inputStyle} />
          <datalist id="stack-options">
            {Object.keys(STACK_DOT).map((s) => <option key={s} value={s} />)}
          </datalist>
          <select value={form.cat} onChange={setField('cat')} style={inputStyle}>
            <option value="web">網頁端</option>
            <option value="app">軟體端</option>
          </select>
          <select value={form.status} onChange={setField('status')} style={inputStyle}>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          <Hoverable as="input" type="text" placeholder="網址（選填）" value={form.url} onChange={setField('url')} onKeyDown={(e) => e.key === 'Enter' && submitProgram()} style={inputStyle} focusStyle={{ borderColor: 'var(--accent)' }} />
          <Hoverable
            as="button"
            onClick={submitProgram}
            style={{ all: 'unset', cursor: 'pointer', textAlign: 'center', padding: '11px 24px', borderRadius: 10, background: 'var(--accent)', color: '#0B0B0D', fontSize: 14, fontWeight: 700, letterSpacing: '.04em', transition: '.25s' }}
            hoverStyle={{ filter: 'brightness(1.08)' }}
          >
            新增
          </Hoverable>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
        {filtered.map((p, i) => {
          const cm = catMeta[p.cat];
          return (
            <Hoverable
              key={p.id || p.name}
              as="div"
              onClick={() => openProgram(p.url)}
              className="prog-row"
              style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '46px 1fr auto auto', alignItems: 'center', gap: 20, padding: '18px 14px', borderBottom: '1px solid var(--border)', transition: '.3s ease', borderRadius: 0 }}
              hoverStyle={{ background: 'var(--surface-2)', paddingLeft: 24 }}
            >
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: 'var(--faint-2)' }}>{pad2(i + 1)}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '.01em' }}>{p.name}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '.06em', color: cm.color, border: `1px solid ${cm.border}`, borderRadius: 5, padding: '2px 8px' }}>{cm.label}</span>
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{p.desc}</span>
              </span>
              <span className="prog-stack" style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#7C9CB5', letterSpacing: '.02em', justifySelf: 'end' }}>{p.stack}</span>
              <span className="prog-status" style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: 'end', minWidth: 78 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot }} />
                <span style={{ fontSize: 12, color: 'var(--text-3)', letterSpacing: '.06em' }}>{p.status}</span>
                {p._custom && (
                  <Hoverable
                    as="button"
                    title="移除"
                    onClick={(e) => { e.stopPropagation(); removeProgram(p.id); }}
                    style={{ all: 'unset', cursor: 'pointer', width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: '50%', color: 'var(--faint-2)', fontSize: 12, transition: '.2s' }}
                    hoverStyle={{ background: '#E0504A', color: '#fff' }}
                  >
                    ✕
                  </Hoverable>
                )}
              </span>
            </Hoverable>
          );
        })}
      </div>
    </section>
  );
}
