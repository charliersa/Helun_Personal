export default function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(6,6,8,.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, cursor: 'zoom-out' }}
    >
      <img src={src} alt="作品" style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 10, boxShadow: '0 30px 80px rgba(0,0,0,.6)' }} />
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 24, right: 30, width: 46, height: 46, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 20, background: 'transparent', cursor: 'pointer' }}
      >
        ✕
      </button>
    </div>
  );
}
