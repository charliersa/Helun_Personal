import useTheme from './hooks/useTheme.js';
import useGallery from './hooks/useGallery.js';
import Background from './components/Background.jsx';
import Header from './components/Header.jsx';
import About from './components/About.jsx';
import ProgramList from './components/ProgramList.jsx';
import Career from './components/Career.jsx';
import VScrollAside from './components/VScrollAside.jsx';
import Learning from './components/Learning.jsx';
import Gallery from './components/Gallery.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const gallery = useGallery();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'clip' }}>
      <Background />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="main-wrap" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '64px 40px 0' }}>
        <About />

        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ProgramList />
            <Career />
          </div>
          <VScrollAside />
        </div>

        <Learning />
        <Gallery {...gallery} />
        <Footer />
      </main>
    </div>
  );
}
