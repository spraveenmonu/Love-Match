import { useParams, Link } from 'react-router-dom';
import { decodeShareData } from '../lib/share';
import SummaryCard from '../components/SummaryCard';
import FloatingHearts from '../components/FloatingHearts';
import '../styles/Summary.css';

export default function Shared() {
  const { data } = useParams();
  const decoded = data ? decodeShareData(data) : null;

  if (!decoded) {
    return (
      <div className="summary-screen">
        <FloatingHearts />
        <main className="cute-card text-center" style={{ maxWidth: '440px', margin: '4rem auto', padding: '2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💌</span>
          <h2>Link Expired or Invalid</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            We couldn't read the shared LoveMatch card. Start a fresh quiz below!
          </p>
          <Link to="/" className="btn btn-primary btn-block">
            Take LoveMatch Now ✨
          </Link>
        </main>
      </div>
    );
  }

  const {
    personA,
    personB,
    loveScore,
    knowScore,
    traitsA,
    traitsB,
    headlineRecommendation,
  } = decoded;

  return (
    <div className="summary-screen">
      <FloatingHearts />

      <main className="summary-screen-content">
        <header className="summary-screen-header">
          <span className="summary-screen-pill">Shared LoveMatch Card 💌</span>
          <h1 className="summary-screen-title">{personA} & {personB}</h1>
          <p className="summary-screen-subtitle">
            A read-only keepsake card celebrating this unique connection.
          </p>
        </header>

        <SummaryCard
          personA={personA}
          personB={personB}
          loveScore={loveScore}
          knowScore={knowScore}
          traitsA={traitsA}
          traitsB={traitsB}
          headlineRecommendation={headlineRecommendation}
          shareData={decoded}
          isReadOnly={true}
        />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <span>Play LoveMatch With Your Person!</span>
            <span className="heart-icon">💖</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
