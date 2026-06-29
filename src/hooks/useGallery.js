import { useCallback, useState } from 'react';
import { cats, catOrder } from '../data/site.js';

// Build the initial per-category image map: defaults overlaid with any saved
// localStorage state (same merge logic as the original loadCat/loadAll).
function loadCat(key) {
  const c = cats[key];
  const base = {};
  c.years.forEach((y) => {
    base[y] = (c.defaultImages[y] || []).slice();
  });
  try {
    const raw = localStorage.getItem(c.store);
    if (raw) {
      const saved = JSON.parse(raw);
      Object.keys(saved).forEach((y) => {
        if (base[y] !== undefined) base[y] = saved[y];
      });
    }
  } catch {}
  return base;
}

function loadAll() {
  const d = {};
  catOrder.forEach((k) => {
    d[k] = loadCat(k);
  });
  return d;
}

function persistCat(key, g) {
  try {
    localStorage.setItem(cats[key].store, JSON.stringify(g));
  } catch {}
}

// Read image files into data URLs (for drag-drop / file picker).
function filesToUrls(fileList) {
  const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
  return Promise.all(
    files.map(
      (f) =>
        new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = () => res(null);
          r.readAsDataURL(f);
        })
    )
  );
}

export default function useGallery() {
  const [data, setData] = useState(loadAll);

  const addImages = useCallback((key, year, urls) => {
    const list = (urls || []).filter(Boolean);
    if (!list.length) return;
    setData((prev) => {
      const next = { ...prev };
      const g = { ...next[key] };
      g[year] = (g[year] || []).concat(list);
      next[key] = g;
      persistCat(key, g);
      return next;
    });
  }, []);

  const removeImage = useCallback((key, year, idx) => {
    setData((prev) => {
      const next = { ...prev };
      const g = { ...next[key] };
      g[year] = (g[year] || []).filter((_, i) => i !== idx);
      next[key] = g;
      persistCat(key, g);
      return next;
    });
  }, []);

  const addFiles = useCallback(
    (key, year, fileList) => {
      filesToUrls(fileList).then((urls) => addImages(key, year, urls));
    },
    [addImages]
  );

  return { data, addImages, removeImage, addFiles };
}
