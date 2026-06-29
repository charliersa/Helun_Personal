import { useEffect, useState } from 'react';
import ImageSlot from './ImageSlot.jsx';

const SLOTS = [0, 1, 2, 3];

export default function VScrollAside() {
  const [v, setV] = useState(0);

  // Auto-advance through the four frames (original: setInterval every 4200ms).
  useEffect(() => {
    const id = setInterval(() => setV((prev) => (prev + 1) % SLOTS.length), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="v-scroll-aside" style={{ display: 'flex', flexDirection: 'column', animation: 'fadeUp .7s .15s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '.24em', color: 'var(--faint)', textTransform: 'uppercase' }}>卷軸 · 直式</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--faint-2)' }}>{'0' + (v + 1)} / 04</span>
      </div>
      <div style={{ position: 'relative', flex: 'none', height: 300, borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--panel)' }}>
        <div style={{ position: 'absolute', inset: 0, transition: 'transform .8s cubic-bezier(.7,0,.2,1)', transform: `translateY(${-v * 100}%)` }}>
          {SLOTS.map((i) => (
            <div key={i} style={{ position: 'relative', height: '100%', width: '100%' }}>
              <ImageSlot id={`cv${i + 1}`} placeholder="拖放圖片" fit="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 3 }}>
          {SLOTS.map((i) => (
            <button
              key={i}
              onClick={() => setV(i)}
              style={{ all: 'unset', cursor: 'pointer', width: 6, height: v === i ? 22 : 6, borderRadius: 4, background: v === i ? '#E8A18C' : 'var(--track-dim)', transition: '.3s' }}
            />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: 'linear-gradient(transparent,rgba(8,8,10,.85))', pointerEvents: 'none' }} />
      </div>
    </aside>
  );
}
