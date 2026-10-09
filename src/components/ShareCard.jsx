import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { generateShareUrl, copyToClipboard } from '../lib/share';
import '../styles/ShareCard.css';

/**
 * Shareable results card with download/copy functionality.
 * @param {{
 *   personA: string,
 *   personB: string,
 *   loveScore: number,
 *   knowScore: number,
 *   interpretation: { title: string, emoji: string },
 *   shareData: Object
 * }} props
 */
export default function ShareCard({ personA, personB, loveScore, knowScore, interpretation, shareData }) {
  const cardRef = useRef(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '1080px',
          height: '1350px',
        },
      });
      const link = document.createElement('a');
      link.download = `lovematch-${personA}-${personB}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Image downloaded! 📸');
    } catch (err) {
      console.error('Download failed:', err);
      showToast('Download failed, try again');
    }
  };

  const handleCopyLink = async () => {
    const url = generateShareUrl(shareData);
    const success = await copyToClipboard(url);
    showToast(success ? 'Link copied! 🔗' : 'Failed to copy');
  };

  return (
    <div className="share-card-wrapper">
      <div ref={cardRef} className="share-card share-card-bg-gradient">
        <span className="share-card-logo">💕 LoveMatch</span>

        <div className="share-card-names">
          <span className="share-card-name">{personA}</span>
          <span className="share-card-heart">💗</span>
          <span className="share-card-name">{personB}</span>
        </div>

        <div className="share-card-scores">
          <div className="share-card-score-block">
            <span className="share-card-score-value">{loveScore}%</span>
            <span className="share-card-score-label">Love Score</span>
          </div>
          <div className="share-card-divider" />
          <div className="share-card-score-block">
            <span className="share-card-score-value">{knowScore}%</span>
            <span className="share-card-score-label">Know Score</span>
          </div>
        </div>

        <span className="share-card-emoji">{interpretation.emoji}</span>
        <p className="share-card-interpretation">{interpretation.title}</p>

        <span className="share-card-footer">lovematch • just for fun 💫</span>
      </div>

      <div className="share-actions">
        <button className="btn btn-primary" onClick={handleDownload}>
          📸 Download Image
        </button>
        <button className="btn btn-secondary" onClick={handleCopyLink}>
          🔗 Copy Link
        </button>
      </div>

      {toast && <div className="share-toast">{toast}</div>}
    </div>
  );
}
