import { useEffect, useRef, useState } from 'react';
import Hoverable from './Hoverable.jsx';
import Lightbox from './Lightbox.jsx';

const STORE = 'helun-vscroll-v1';
const pad2 = (n) => String(n).padStart(2, '0');

// Cloudinary unsigned upload — browser posts the file straight to the cloud
// library, so we store a permanent public URL, not a bulky base64 blob.
const CLOUD_NAME = 'dbiirpmpy';
const UPLOAD_PRESET = 'cloud_img';
const UPLOAD_FOLDER = 'helun/vscroll';

function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', UPLOAD_FOLDER);
  return fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
    .then((r) => r.json())
    .then((j) => (j.secure_url ? { url: j.secure_url, token: j.delete_token || null } : null))
    .catch(() => null);
}

// Delete an asset with the delete_token returned at upload — only works within
// ~10 min of upload, and only if the preset has "Return delete token" on.
function deleteByToken(token) {
  const fd = new FormData();
  fd.append('token', token);
  return fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`, { method: 'POST', body: fd }).catch(() => {});
}

// Self-service image list, persisted to localStorage — paste a URL, pick files,
// or drag-drop. Mirrors the gallery's add/remove pattern.
function load() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const a = JSON.parse(raw);
      if (Array.isArray(a)) return a;
    }
  } catch {}
  return [];
}

function persist(arr) {
  try {
    localStorage.setItem(STORE, JSON.stringify(arr));
  } catch {}
}

export default function VScrollAside({ isAdmin }) {
  const [images, setImages] = useState(load);
  const [v, setV] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  // url -> delete_token, in memory only (tokens expire ~10 min after upload).
  const deleteTokens = useRef({});

  const count = images.length;
  const active = count ? v % count : 0;

  // Auto-advance through the frames (original: setInterval every 4200ms).
  useEffect(() => {
    if (count < 2) return undefined;
    const id = setInterval(() => setV((prev) => (prev + 1) % count), 4200);
    return () => clearInterval(id);
  }, [count]);

  const addImages = (urls) => {
    const list = (urls || []).filter(Boolean);
    if (!list.length) return;
    setImages((prev) => {
      const next = prev.concat(list);
      persist(next);
      return next;
    });
  };

  const removeImage = (idx) => {
    const url = images[idx];
    const token = url && deleteTokens.current[url];
    if (token) {
      deleteByToken(token);
      delete deleteTokens.current[url];
    }
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      persist(next);
      return next;
    });
    setV((prev) => (prev >= count - 1 ? 0 : prev));
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    Promise.all(files.map((f) => uploadToCloudinary(f)))
      .then((results) => {
        const ok = results.filter(Boolean);
        ok.forEach((r) => { if (r.token) deleteTokens.current[r.url] = r.token; });
        addImages(ok.map((r) => r.url));
        if (ok.length < files.length) {
          alert(`有 ${files.length - ok.length} 張圖上傳失敗，請確認 Cloudinary 的 upload preset「${UPLOAD_PRESET}」為 Unsigned。`);
        }
      })
      .finally(() => setUploading(false));
  };

  const submitUrl = () => {
    const val = urlInput.trim();
    if (val) {
      addImages([val]);
      setUrlInput('');
    }
  };

  return (
    <aside className="v-scroll-aside" style={{ display: 'flex', flexDirection: 'column', animation: 'fadeUp .7s .15s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '.24em', color: 'var(--faint)', textTransform: 'uppercase' }}>卷軸 · 直式</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--faint-2)' }}>{count ? `${pad2(active + 1)} / ${pad2(count)}` : '00 / 00'}</span>
      </div>

      <div style={{ position: 'relative', flex: 'none', height: 300, borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--panel)' }}>
        <div style={{ position: 'absolute', inset: 0, transition: 'transform .8s cubic-bezier(.7,0,.2,1)', transform: `translateY(${-active * 100}%)` }}>
          {images.map((src, i) => (
            <div key={src + i} style={{ position: 'relative', height: '100%', width: '100%' }}>
              <img src={src} alt="卷軸圖片" loading="lazy" onClick={() => setLightbox(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} />
              {isAdmin && (
                <Hoverable
                  as="button"
                  onClick={() => removeImage(i)}
                  title="移除"
                  style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: 10, left: 10, width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 14, backdropFilter: 'blur(4px)', zIndex: 4, transition: '.2s' }}
                  hoverStyle={{ background: '#E0504A' }}
                >
                  ✕
                </Hoverable>
              )}
            </div>
          ))}
        </div>

        {count === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center', padding: 20, color: 'var(--text-3)', pointerEvents: 'none' }}>
            <span style={{ fontSize: 26, opacity: 0.5 }}>＋</span>
            <span style={{ fontSize: 13 }}>{isAdmin ? '尚無圖片，於下方新增' : '尚無圖片'}</span>
          </div>
        )}

        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 3 }}>
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setV(i)}
              style={{ all: 'unset', cursor: 'pointer', width: 6, height: active === i ? 22 : 6, borderRadius: 4, background: active === i ? '#E8A18C' : 'var(--track-dim)', transition: '.3s' }}
            />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: 'linear-gradient(transparent,rgba(8,8,10,.85))', pointerEvents: 'none' }} />
      </div>

      {isAdmin && (
      <>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <Hoverable
          as="input"
          type="text"
          placeholder="貼上圖片網址…"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitUrl();
          }}
          style={{ flex: 1, minWidth: 140, padding: '9px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, fontFamily: "'Noto Sans TC',sans-serif", outline: 'none' }}
          focusStyle={{ borderColor: 'var(--accent)' }}
        />
        <Hoverable
          as="button"
          onClick={submitUrl}
          style={{ all: 'unset', cursor: 'pointer', padding: '9px 18px', borderRadius: 9, background: 'var(--accent)', color: '#0B0B0D', fontSize: 13, fontWeight: 700, letterSpacing: '.04em', transition: '.25s' }}
          hoverStyle={{ filter: 'brightness(1.08)' }}
        >
          新增
        </Hoverable>
      </div>

      <label
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer?.files) addFiles(e.dataTransfer.files); }}
        onDragOver={(e) => { e.preventDefault(); if (!dragging) setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10, borderRadius: 12, border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-2)'}`, background: dragging ? 'rgba(232,161,140,.10)' : 'var(--surface)', padding: 16, cursor: 'pointer', textAlign: 'center', transition: '.2s' }}
      >
        <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '1.5px solid var(--border-2)', fontSize: 17, color: 'var(--text-3)' }}>＋</span>
        <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{uploading ? '上傳中…請稍候' : '選檔，或把圖片拖放到這裡'}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
          style={{ display: 'none' }}
        />
      </label>
      </>
      )}

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </aside>
  );
}
