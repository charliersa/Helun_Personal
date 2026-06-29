const NOISE =
  "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22220%22 height=%22220%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E";

export default function Background() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `url('${NOISE}')`, opacity: 0.05, mixBlendMode: 'overlay',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', top: '-20%', left: '-10%', width: '55vw', height: '55vw',
          zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle,rgba(232,161,140,.10),transparent 65%)', filter: 'blur(20px)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', bottom: '-25%', right: '-15%', width: '55vw', height: '55vw',
          zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle,rgba(124,156,181,.08),transparent 65%)', filter: 'blur(20px)',
        }}
      />
    </>
  );
}
