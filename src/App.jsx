import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SessionProvider, useSession } from './context/SessionContext';
import Landing from './screens/Landing';
import Setup from './screens/Setup';
import Module1 from './screens/Module1';
import Module2 from './screens/Module2';
import Module3 from './screens/Module3';
import Summary from './screens/Summary';
import Shared from './screens/Shared';
import './styles/global.css';

function Header() {
  const { state, dispatch } = useSession();

  const handleReset = () => {
    if (state.personA) {
      if (window.confirm('Start over from the beginning? ✨')) {
        dispatch({ type: 'RESET_SESSION' });
      }
    }
  };

  return (
    <header className="app-header">
      <Link to="/" className="app-logo" onClick={handleReset} aria-label="LoveMatch Home">
        <span className="app-logo-heart" aria-hidden="true">💖</span>
        <span>LoveMatch</span>
      </Link>

      {state.personA && state.personB && (
        <span className="badge app-couple-badge">
          <span>{state.personA}</span>
          <span className="badge-heart" aria-hidden="true">💕</span>
          <span>{state.personB}</span>
        </span>
      )}
    </header>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-container">
      <Header />
      <div key={location.pathname} className="page-transition-wrapper">
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/module1" element={<Module1 />} />
          <Route path="/module2" element={<Module2 />} />
          <Route path="/module3" element={<Module3 />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/shared/:data" element={<Shared />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <Router>
        <AppContent />
      </Router>
    </SessionProvider>
  );
}
