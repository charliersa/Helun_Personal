import { useState } from 'react';
import Hoverable from './Hoverable.jsx';
import Lightbox from './Lightbox.jsx';
import { cats, catOrder, initialCatYear } from '../data/site.js';
import { parseCollection } from '../utils/collection.js';

const pad2 = (n) => String(n).padStart(2, '0');

export default function Gallery({ data, addImages, removeImage, addFiles }) {
  const [activeCat, setActiveCat] = useState(null);
  const [catYear, setCatYear] = useState(initialCatYear);
  const [lightbox, setLightbox] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  // ---- Hub view data ----
  const hubCats = catOrder.map((key) => {
    const c = cats[key];
    const g = data[key] || {};
    let total = 0;
    let cover = '';
    c.years.forEach((y) => {
      const arr = g[y] || [];
      total += arr.length;
      if (!cover && arr.length) cover = arr[0];
    });
    return { key, label: c.label, en: c.en, countLabel: `${total} 件作品`, cover, total };
  });
  const worksTotal = hubCats.reduce((n, c) => n + c.total, 0);

  const openCat = (key) => setActiveCat(key);
  const backToHub = () => setActiveCat(null);

  // ---- Detail view data ----
  let detail = null;
  if (activeCat) {
    const meta = cats[activeCat];
    const g = data[activeCat] || {};
    const activeYear = catYear[activeCat];
    const maxYear = meta.years[0];
    const canAdd = activeYear === maxYear;
    const activeTotal = meta.years.reduce((n, y) => n + (g[y] || []).length, 0);

    const flatItems = (g[activeYear] || []).map((src, i) => ({
      src, tag: `${activeYear} · ${pad2(i + 1)}`, aspect: meta.aspect, originalIndex: i,
    }));

    let groups;
    if (meta.grouped) {
      const order = [];
      const map = {};
      (g[activeYear] || []).forEach((src, i) => {
        const col = parseCollection(src);
        if (!map[col]) { map[col] = []; order.push(col); }
        map[col].push({ src, i });
      });
      groups = order.map((label) => ({
        label, hasLabel: true, countLabel: `${map[label].length} 件`,
        items: map[label].map((o, j) => ({
          src: o.src, tag: `${label} · ${pad2(j + 1)}`, aspect: meta.aspect, originalIndex: o.i,
        })),
      }));
    } else {
      groups = [{ label: '', hasLabel: false, countLabel: '', items: flatItems }];
    }

    detail = { meta, activeYear, canAdd, activeTotal, groups };
  }

  const submitUrl = () => {
    const v = urlInput.trim();
    if (v && activeCat) {
      addImages(activeCat, detail.activeYear, [v]);
      setUrlInput('');
    }
  };

  return (
    <section id="works" className="sec-gap" style={{ marginTop: 104, animation: 'fadeUp .7s both' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.3em', color: 'var(--accent)', textTransform: 'uppercase' }}>02 / Gallery</div>
          <h2 className="sec-h2" style={{ marginTop: 10, fontSize: 38, fontWeight: 900, letterSpacing: '-.01em' }}>作品展覽</h2>
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: 'var(--faint-2)', textAlign: 'right', lineHeight: 1.7, paddingBottom: 6 }}>{worksTotal} WORKS<br />4 CATEGORIES</div>
      </div>

      {/* ---- Hub ---- */}
      {!activeCat && (
        <div className="hub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
          {hubCats.map((c) => (
            <Hoverable
              as="button"
              key={c.key}
              onClick={() => openCat(c.key)}
              style={{ all: 'unset', cursor: 'pointer', position: 'relative', display: 'block', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--panel)', height: 280, transition: '.35s' }}
              hoverStyle={{ transform: 'translateY(-6px)', borderColor: 'rgba(232,161,140,.45)' }}
            >
              {c.cover && (
                <img src={c.cover} alt={c.label} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.78 }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(8,8,10,.15),rgba(8,8,10,.82))' }} />
              <div style={{ position: 'absolute', left: 24, bottom: 22, right: 24 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '.22em', color: 'var(--accent)', textTransform: 'uppercase' }}>{c.en}</div>
                <div style={{ marginTop: 6, fontSize: 26, fontWeight: 900, color: '#fff' }}>{c.label}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{c.countLabel}</div>
              </div>
              <span style={{ position: 'absolute', top: 18, right: 20, width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 16, backdropFilter: 'blur(4px)' }}>↗</span>
            </Hoverable>
          ))}
        </div>
      )}

      {/* ---- Detail ---- */}
      {activeCat && detail && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
            <Hoverable
              as="button"
              onClick={backToHub}
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 100, border: '1px solid var(--border-2)', color: 'var(--text-2)', fontSize: 13.5, transition: '.25s' }}
              hoverStyle={{ background: 'var(--surface-2)', color: 'var(--text)' }}
            >
              ← 返回分類
            </Hoverable>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{detail.meta.label}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.06em', color: 'var(--text-3)' }}>{detail.activeTotal} 件 · 點圖放大</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {detail.meta.years.map((y) => {
              const on = detail.activeYear === y;
              const g = data[activeCat] || {};
              return (
                <button
                  key={y}
                  onClick={() => setCatYear((prev) => ({ ...prev, [activeCat]: y }))}
                  style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 100, border: `1px solid ${on ? 'var(--chip-on-bg)' : 'var(--border-2)'}`, background: on ? 'var(--chip-on-bg)' : 'var(--surface)', color: on ? 'var(--chip-on-text)' : 'var(--text-2)', fontFamily: "'Space Mono',monospace", fontSize: 13, letterSpacing: '.04em', transition: '.25s' }}
                >
                  {y}
                  <span style={{ fontSize: 10.5, opacity: 0.65 }}>{pad2((g[y] || []).length)}</span>
                </button>
              );
            })}
          </div>

          {detail.canAdd && (
            <div className="add-row" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <Hoverable
                as="input"
                type="text"
                placeholder="貼上圖片網址後按新增…"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitUrl();
                }}
                style={{ flex: 1, minWidth: 240, padding: '11px 16px', borderRadius: 10, border: '1px solid var(--border-2)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontFamily: "'Noto Sans TC',sans-serif", outline: 'none' }}
                focusStyle={{ borderColor: 'var(--accent)' }}
              />
              <Hoverable
                as="button"
                onClick={submitUrl}
                style={{ all: 'unset', cursor: 'pointer', padding: '11px 24px', borderRadius: 10, background: 'var(--accent)', color: '#0B0B0D', fontSize: 14, fontWeight: 700, letterSpacing: '.04em', transition: '.25s' }}
                hoverStyle={{ filter: 'brightness(1.08)' }}
              >
                新增至 {detail.activeYear}
              </Hoverable>
            </div>
          )}

          {detail.groups.map((grp, gi) => (
            <div key={gi}>
              {grp.hasLabel && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 14px' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '.02em' }}>{grp.label}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--text-3)' }}>{grp.countLabel}</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
              )}
              <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 16, marginBottom: 26 }}>
                {grp.items.map((p) => (
                  <Hoverable
                    key={p.originalIndex + p.src}
                    style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--panel)', aspectRatio: p.aspect, transition: 'transform .35s' }}
                    hoverStyle={{ transform: 'translateY(-5px)' }}
                  >
                    <img src={p.src} alt="作品" loading="lazy" onClick={() => setLightbox(p.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }} />
                    <Hoverable
                      as="button"
                      onClick={() => removeImage(activeCat, detail.activeYear, p.originalIndex)}
                      title="移除"
                      style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: 9, right: 9, width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 14, backdropFilter: 'blur(4px)', transition: '.2s' }}
                      hoverStyle={{ background: '#E0504A' }}
                    >
                      ✕
                    </Hoverable>
                    <span style={{ position: 'absolute', left: 10, bottom: 10, fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '.06em', color: '#fff', background: 'rgba(0,0,0,.5)', padding: '3px 8px', borderRadius: 6, backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>{p.tag}</span>
                  </Hoverable>
                ))}
              </div>
            </div>
          ))}

          {detail.canAdd && (
            <label
              onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer?.files) addFiles(activeCat, detail.activeYear, e.dataTransfer.files); }}
              onDragOver={(e) => { e.preventDefault(); if (!dragging) setDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, borderRadius: 14, border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-2)'}`, background: dragging ? 'rgba(232,161,140,.10)' : 'var(--surface)', padding: 26, cursor: 'pointer', textAlign: 'center', transition: '.2s' }}
            >
              <span style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '1.5px solid var(--border-2)', fontSize: 20, color: 'var(--text-3)' }}>＋</span>
              <span style={{ fontSize: 14, color: 'var(--text-2)' }}>點此選檔，或把圖片拖放到這裡新增至 {detail.activeYear}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => { if (e.target.files) addFiles(activeCat, detail.activeYear, e.target.files); e.target.value = ''; }}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </>
      )}

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
