import { useState, useEffect } from "react";
import "./App.css";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function decodeHTML(text) {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

const funCategories = [
  11, // Film
  12, // Music
  14, // Television
  15, // Video Games
  26, // Celebrities
  27, // Animals
  31, // Anime & Manga
  32, // Cartoon & Animations
];

function getRandomCategories(count) {
  const shuffled = shuffle(funCategories);
  return shuffled.slice(0, count);
}

function App() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  function loadQuestions() {
    setLoading(true);
    setError(null);

    const chosenCategories = getRandomCategories(4);
    const requests = chosenCategories.map((cat) =>
      fetch(`https://opentdb.com/api.php?amount=5&category=${cat}`).then(
        (res) => res.json(),
      ),
    );

    Promise.all(requests)
      .then((results) => {
        const allQuestions = results
          .filter((data) => data.response_code === 0)
          .flatMap((data) => data.results);

        if (allQuestions.length === 0) {
          setError("No questions came back — try again in a few seconds.");
        } else {
          setQuestions(shuffle(allQuestions));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(
          "Failed to load questions. Check your connection and try again.",
        );
        setLoading(false);
      });
  }

  function handleStart() {
    setStarted(true);
    loadQuestions();
  }

  function handlePlayAgain() {
    setCurrentIndex(0);
    setScore(0);
    loadQuestions();
  }

  // Start screen
  if (!started) {
    return (
      <div className="app-background">
        <div className="quiz-container start-screen">
          <div className="bounce-mascot">🎉</div>
          <h1 className="app-title">Quiz Night</h1>
          <p className="app-subtitle">
            Film, music, games, celebrities & more — fast, fun rounds for you
            and your friends.
          </p>
          <button className="start-btn" onClick={handleStart}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-background">
        <div className="quiz-container">
          <p className="status-text">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-background">
        <div className="quiz-container">
          <p className="status-text">{error}</p>
          <button className="start-btn" onClick={loadQuestions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (currentIndex >= questions.length) {
    const percent = Math.round((score / questions.length) * 100);
    const resultEmoji = percent >= 70 ? "🏆" : percent >= 40 ? "🎊" : "🎯";
    return (
      <div className="app-background">
        <div className="quiz-container start-screen">
          <div className="bounce-mascot">{resultEmoji}</div>
          <h1 className="app-title">Quiz Complete!</h1>
          <p className="score-text">
            {score} / {questions.length}
          </p>
          <button className="start-btn" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const answers = shuffle([
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ]);

  function handleAnswerClick(answer) {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  }

  function handleNext() {
    setSelectedAnswer(null);
    setCurrentIndex(currentIndex + 1);
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="app-background">
      <div className="quiz-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="question-count">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <h2>{decodeHTML(currentQuestion.question)}</h2>
        <div className="answers">
          {answers.map((answer) => {
            let className = "answer-btn";
            if (selectedAnswer) {
              if (answer === currentQuestion.correct_answer) {
                className += " correct bounce-correct";
              } else if (answer === selectedAnswer) {
                className += " incorrect shake-incorrect";
              }
            }
            return (
              <button
                key={answer}
                className={className}
                onClick={() => handleAnswerClick(answer)}
              >
                {decodeHTML(answer)}
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
    </div>
  );
}

export default App;
