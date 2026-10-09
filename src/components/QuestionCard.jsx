import '../styles/QuestionCard.css';

const optionLabels = ['A', 'B', 'C', 'D'];

/**
 * Single question card with selectable options and sweet micro-animations.
 * @param {{
 *   question: import('../data/questions').Question,
 *   questionNumber: number,
 *   onAnswer: (answer: string) => void,
 *   selectedAnswer?: string,
 *   disabled?: boolean
 * }} props
 */
export default function QuestionCard({ question, questionNumber, onAnswer, selectedAnswer, disabled }) {
  const categoryLabels = {
    basics: 'Basics 🌸',
    relationship: 'Relationship 💖',
    personality: 'Personality ✨',
    deep: 'Deep & Values 💌',
  };

  return (
    <div className="question-card cute-card">
      <div className="question-card-header">
        <span className="question-card-badge">{questionNumber}</span>
        <span className="question-card-category">
          {categoryLabels[question.category] || question.category}
        </span>
      </div>

      <h3 className="question-card-text">{question.text}</h3>

      <div className="question-card-options" role="radiogroup" aria-label={question.text}>
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={option}
              type="button"
              className={`question-card-option ${isSelected ? 'selected' : ''}`}
              onClick={() => !disabled && onAnswer(option)}
              disabled={disabled}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
            >
              <span className="question-card-option-marker">
                {isSelected ? '💕' : optionLabels[idx]}
              </span>
              <span className="question-card-option-label">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
