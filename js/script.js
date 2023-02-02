import { countries } from "../data/countries_data.js";
import { questions_limiter, timeleft_init } from "../options/quiz_options.js";

const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const resetBtn = document.getElementById("reset");
const quiz_info = document.getElementById("quiz-info");

// the limiter limits the questions
let limiter = questions_limiter;

if (limiter > countries.length) {
  limiter = countries.length;
}

// reorder countries in the questionnaire
let quizData = _.sampleSize(countries, limiter);

let currentQuiz = 0;
let score = 0;

loadQuiz();

function loadQuiz() {
  deselectAnswers();

  quiz_info.innerHTML = `${currentQuiz + 1} / ${limiter}`;

  const currentQuizData = quizData[currentQuiz];

  questionEl.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;
}

function deselectAnswers() {
  answerEls.forEach((answerEl) => (answerEl.checked = false));
}

function getSelected() {
  let answer;

  answerEls.forEach((answerEl) => {
    if (answerEl.checked) {
      answer = answerEl.id;
    }
  });

  return answer;
}

let timeleft = timeleft_init;
var downloadTimer = setInterval(function () {
  if (timeleft < 0) {
    playQuiz();
  } else {
    document.getElementById("countdown").innerHTML = `${timeleft}`;
  }
  timeleft -= 1;
}, 1000);

function playQuiz() {
  let answer = getSelected();

  if (!answer) {
    answer = "no answer";
  }

  if (answer) {
    if (answer === quizData[currentQuiz].correct) {
      score++;
    }

    currentQuiz++;
    // quiz_info.innerHTML = `${currentQuiz} / ${limiter}`;

    // console.log(currentQuiz, limiter);
    timeleft = timeleft_init;

    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else if (score !== quizData.length) {
      quiz.innerHTML = `
                <h3>Отговорихте правилно на ${score} от общо ${quizData.length} въпроса</h3>
                <button class="button" onclick="location.reload()">Reload</button>
            `;
      clearInterval(downloadTimer);
    } else {
      quiz.innerHTML = `
                <h3>Поздравления! <br /> Всички отговори са верни!</h3>
                <button class="button" onclick="location.reload()">Reload</button>
            `;
      clearInterval(downloadTimer);

      party.confetti(quiz);
    }
  }
}
submitBtn.addEventListener("click", playQuiz);

function resetQuiz() {
  currentQuiz = 0;
  score = 0;
  timeleft = timeleft_init;
  loadQuiz();
}
resetBtn.addEventListener("click", resetQuiz);
