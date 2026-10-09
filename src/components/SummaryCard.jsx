import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { generateShareUrl, copyToClipboard } from '../lib/share';
import '../styles/SummaryCard.css';

/**
 * 1080x1350 Pink Gradient Final Summary Card with download & share functionality.
 * @param {{
 *   personA: string,
 *   personB: string,
 *   loveScore: number,
 *   knowScore: number,
 *   traitsA: { unconditional: number, caring: number, trueness: number, badges: string[] },
 *   traitsB: { unconditional: number, caring: number, trueness: number, badges: string[] },
 *   headlineRecommendation: string,
 *   shareData: Object,
 *   onRetake?: () => void,
 *   isReadOnly?: boolean
 * }} props
 */
export default function SummaryCard({
  personA,
  personB,
  loveScore = 0,
  knowScore = 0,
  traitsA = { badges: ['Unconditional Heart', 'Caring Soul'] },
  traitsB = { badges: ['True Blue', 'Balanced Care'] },
  headlineRecommendation = 'Nurture your beautiful bond with daily appreciation and shared adventures!',
  shareData,
  onRetake,
  isReadOnly = false,
}) {
  const cardRef = useRef(null);
  const [toast, setToast] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      showToast('Generating high-res card... 🎨');

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFF0F5',
      });

      const link = document.createElement('a');
      link.download = `LoveMatch-${personA || 'A'}-and-${personB || 'B'}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Card saved! 📸✨');
    } catch (err) {
      console.error('Download failed:', err);
      showToast('Could not download image. Try copying link!');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    const url = generateShareUrl(shareData || { personA, personB, loveScore, knowScore });
    const success = await copyToClipboard(url);
    if (success) {
      showToast('Share link copied to clipboard! 🔗');
    } else {
      showToast('Failed to copy link');
    }
  };

  return (
    <div className="summary-card-wrapper">
      {/* 1080x1350 Ratio Card */}
      <div ref={cardRef} className="summary-card-canvas">
        <div className="summary-card-watermark">💕 LoveMatch</div>

        <div className="summary-card-header">
          <span className="summary-card-tag">Official Compatibility Certificate</span>
          <h2 className="summary-card-names">
            <span>{personA || 'Person A'}</span>
            <span className="summary-card-names-heart">💗</span>
            <span>{personB || 'Person B'}</span>
          </h2>
        </div>

        {/* Scores Grid */}
        <div className="summary-card-scores-row">
          <div className="summary-score-box">
            <span className="summary-score-num">{loveScore}%</span>
            <span className="summary-score-lbl">Love Vibe</span>
          </div>
          <div className="summary-score-divider" aria-hidden="true">✦</div>
          <div className="summary-score-box">
            <span className="summary-score-num">{knowScore}%</span>
            <span className="summary-score-lbl">Trivia Match</span>
          </div>
        </div>

        {/* Trait Badges */}
        <div className="summary-traits-section">
          <div className="summary-person-traits">
            <span className="summary-person-tag">{personA || 'Person A'}</span>
            <div className="summary-badges-list">
              {(traitsA?.badges || ['Unconditional Heart', 'Caring Soul']).map((badge, idx) => (
                <span key={idx} className="summary-badge-chip">🌸 {badge}</span>
              ))}
            </div>
          </div>

          <div className="summary-person-traits">
            <span className="summary-person-tag">{personB || 'Person B'}</span>
            <div className="summary-badges-list">
              {(traitsB?.badges || ['True Blue', 'Balanced Heart']).map((badge, idx) => (
                <span key={idx} className="summary-badge-chip">🌷 {badge}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Headline Recommendation */}
        <div className="summary-rec-box">
          <span className="summary-rec-icon">💌</span>
          <p className="summary-rec-text">
            &ldquo;{headlineRecommendation}&rdquo;
          </p>
        </div>

        <div className="summary-card-footer">
          <span>Created with LoveMatch • Just for fun, forever warm ✨</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="summary-card-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
          <span className="heart-icon">📸</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCopyLink}
        >
          <span>Copy Share Link</span>
          <span className="heart-icon">🔗</span>
        </button>

        {!isReadOnly && onRetake && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onRetake}
          >
            <span>Retake LoveMatch</span>
            <span>🔄</span>
          </button>
        )}
      </div>

      {toast && (
        <div className="summary-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
