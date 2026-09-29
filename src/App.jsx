import { useState } from "react";
import "./App.css";

const sampleQuestions = [
  {
    question: "What does HTML stand for?",
    correct_answer: "Hyper Text Markup Language",
    incorrect_answers: [
      "Home Tool Markup Language",
      "Hyperlinks Text Mark Language",
      "Hyper Tool Multi Language",
    ],
  },
  {
    question: "Which company developed React?",
    correct_answer: "Meta (Facebook)",
    incorrect_answers: ["Google", "Amazon", "Microsoft"],
  },
  {
    question: "What year was JavaScript created?",
    correct_answer: "1995",
    incorrect_answers: ["1989", "2000", "1998"],
  },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const currentQuestion = sampleQuestions[currentIndex];
  const answers = shuffle([
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ]);

  function handleAnswerClick(answer) {
    if (selectedAnswer) return; // already answered, ignore further clicks
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  }

  function handleNext() {
    setSelectedAnswer(null);
    setCurrentIndex(currentIndex + 1);
  }

  if (currentIndex >= sampleQuestions.length) {
    return (
      <div className="quiz-container">
        <h1>Quiz Complete!</h1>
        <p>
          Your score: {score} / {sampleQuestions.length}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <p>
        Question {currentIndex + 1} of {sampleQuestions.length}
      </p>
      <h2>{currentQuestion.question}</h2>
      <div className="answers">
        {answers.map((answer) => {
          let className = "answer-btn";
          if (selectedAnswer) {
            if (answer === currentQuestion.correct_answer) {
              className += " correct";
            } else if (answer === selectedAnswer) {
              className += " incorrect";
            }
          }
          return (
            <button
              key={answer}
              className={className}
              onClick={() => handleAnswerClick(answer)}
            >
              {answer}
            </button>
          );
        })}
      </div>
      {selectedAnswer && (
        <button className="next-btn" onClick={handleNext}>
          Next
        </button>
      )}
    </div>
  );
}

export default App;
