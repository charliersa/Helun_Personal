import { useEffect, useState } from 'react';

const ADMIN_KEY = 'helun-admin';
// 管理密碼 — 改成你自己的（原始 HTML 版 個人形象網站.dc.html 的 ADMIN_PASSWORD 也要改成一樣）
const ADMIN_PASSWORD = 'helun2026';

// Client-side admin gate: unlock by visiting with #admin in the URL and
// entering the password. NOT real security (a static site can't hide the
// upload preset) — it just keeps casual visitors out of the editing UI.
export default function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isAdmin) return;
    if ((window.location.hash || '').toLowerCase().includes('admin')) {
      const pw = window.prompt('請輸入管理密碼');
      if (pw === ADMIN_PASSWORD) {
        try {
          localStorage.setItem(ADMIN_KEY, '1');
        } catch {}
        setIsAdmin(true);
      } else if (pw !== null) {
        window.alert('密碼錯誤');
      }
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {}
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lockAdmin = () => {
    try {
      localStorage.removeItem(ADMIN_KEY);
    } catch {}
    setIsAdmin(false);
  };

  return { isAdmin, lockAdmin };
}
