import { useRef, useState } from 'react';

const STORE_PREFIX = 'helun-imageslot-';

function load(id) {
  try {
    return localStorage.getItem(STORE_PREFIX + id) || '';
  } catch {
    return '';
  }
}

function save(id, src) {
  try {
    if (src) localStorage.setItem(STORE_PREFIX + id, src);
    else localStorage.removeItem(STORE_PREFIX + id);
  } catch {}
}

/**
 * A user-fillable image placeholder — drag an image file onto it (or click to
 * browse) and it fills the slot. The dropped image persists across reloads via
 * localStorage keyed on `id`. A simplified React port of the original
 * <image-slot> web component.
 */
export default function ImageSlot({ id, src: initialSrc, placeholder = 'Drop an image', fit = 'cover', style }) {
  const [src, setSrc] = useState(() => load(id) || initialSrc || '');
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  const setImage = (dataUrl) => {
    setSrc(dataUrl);
    save(id, dataUrl);
  };

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => setImage(r.result);
    r.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer?.files?.[0];
    readFile(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
      onDrop={onDrop}
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'var(--img-bg)',
        border: `1px ${over ? 'solid var(--accent)' : 'dashed var(--img-border)'}`,
        ...style,
      }}
    >
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
      ) : (
        <span style={{ fontSize: 13, color: 'var(--text-3)', letterSpacing: '.04em', padding: 12, textAlign: 'center' }}>{placeholder}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = ''; }}
        style={{ display: 'none' }}
      />
    </div>
  );
}
