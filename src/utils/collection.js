// Derive a collection name from an image URL — used to group the 3D-model
// category by sub-folder (e.g. ".../2025/CrystalElf/CrystalElf_1.jpg" -> "CrystalElf").
export function parseCollection(src) {
  const path = src.split('?')[0];
  const parts = path.split('/');
  const fname = parts[parts.length - 1];
  let yi = -1;
  for (let k = 0; k < parts.length; k++) {
    if (/^(19|20)\d{2}$/.test(parts[k])) yi = k;
  }
  if (yi >= 0 && parts.length - yi > 2) return parts[yi + 1];
  const base = fname.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]?\d+$/, '');
  return base || '其他';
}
