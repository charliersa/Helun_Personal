# 杜赫倫 · Helun 個人形象網站（React 版）

原本以 `dc-runtime` 自訂模板（`x-dc` / `sc-for` / `{{ }}`）撰寫、在瀏覽器即時編譯成 React 的單頁網站，已改寫為標準 **Vite + React** 專案。

## 開發 / 建置

```bash
npm install      # 安裝相依套件
npm run dev      # 啟動開發伺服器（http://localhost:5173）
npm run build    # 產生正式檔到 dist/
npm run preview  # 預覽 build 結果
```

## 專案結構

```
index.html                # Vite 進入點（字型、favicon）
src/
  main.jsx                # React 掛載點
  App.jsx                 # 版面組合（Header / About / 各區塊 / Footer）
  styles.css              # 全域樣式：主題變數、深淺色、RWD
  data/site.js            # 所有資料：作品圖片網址、程式清單、工作/學習經歷等
  hooks/
    useTheme.js           # 深淺色主題（localStorage 記憶）
    useGallery.js         # 作品集圖片狀態 + localStorage 持久化
  utils/collection.js     # 3D 模型依子資料夾分組
  components/
    Background.jsx        # 背景雜訊與光暈
    Header.jsx            # 標頭、導覽、主題切換
    About.jsx             # 關於我 + 技能標籤
    ProgramList.jsx       # 開發程式清單（全部 / 網頁端 / 軟體端 篩選）
    Career.jsx            # 工作經歷
    Learning.jsx          # 學習歷程
    VScrollAside.jsx      # 直式自動輪播
    ImageSlot.jsx         # 可拖放填圖的占位元件（localStorage 記憶）
    Gallery.jsx           # 作品展覽（分類總覽 + 年度檢視、新增/移除、燈箱）
    Lightbox.jsx          # 點圖放大
    Hoverable.jsx         # 對應原本 style-hover / style-focus 的 hover 樣式
```

## 行為對應

- **主題**：`data-theme` 屬性 + CSS 變數，與原版一致，記憶於 `localStorage('helun-theme')`。
- **作品集**：每個分類各自存於 `localStorage`（key 見 `data/site.js` 的 `cats[*].store`）。預設圖片與使用者新增的圖片合併顯示，可貼網址或拖放/選檔新增、可移除。
- **3D 模型**分類依網址中的子資料夾名稱自動分組顯示。

## 備註

原始檔（`個人形象網站.dc.html`、`support.js`、`image-slot.js`）仍保留作為參考，未刪除。如不再需要可自行移除。
