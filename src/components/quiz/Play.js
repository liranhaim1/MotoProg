import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../store";
import { playSound, sounds } from "../../utils/sounds";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import CircularProgressWithLabel from "./Percentage";

import Stack from "@mui/material/Stack";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Typography,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { RatingStars } from "./RateStars";

import { loadQuestions, loadSortedQuestion } from "../../utils/questions";
import Resaerch from "./Research";

const questionTime = 120; // 2 minutes
const categoriesData = [];

function shuffleArrayInChunks(arr, chunkSize) {
  for (let i = 0; i < arr.length; i += chunkSize) {
    // Get the subarray of `chunkSize` elements from the current position
    const chunk = arr.slice(i, i + chunkSize);
    // Shuffle the elements in the chunk
    shuffle(chunk);
    // Replace the original elements with the shuffled elements
    arr.splice(i, chunkSize, ...chunk);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function RateModal({ onSubmit }) {
  return (
    <Stack className={classnames("rate-modal")}>
      <Stack className="rate-modal-blur" />
      <Stack className="modal">
        <Typography variant="h4">Question review</Typography>
        <RatingStars onSubmit={onSubmit} />
      </Stack>
    </Stack>
  );
}

function Timer({ totalSeconds, onEnd }) {
  const [count, setCount] = useState(totalSeconds);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count - 1);
      if (count <= 0) {
        clearInterval(intervalId);
        onEnd();
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [count, totalSeconds, onEnd]);

  const minutes = Math.floor(count / 60);
  const seconds = count % 60;

  return (
    <Stack direction="row" className="timer">
      <Typography>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </Typography>
      <span className="mdi mdi-clock-outline mdi-24px" />
    </Stack>
  );
}

function Play(props) {
  const navigate = useNavigate();
  const urlSplit = window.location.href.split("/");
  const questionSet = urlSplit[urlSplit.length - 1];

  const [counter, setCounter] = useState(0);
  const [counterLimit, setCounterLimit] = useState(2);
  const [userRateCount, setUserCount] = useState(0);
  const [globalRateCounter, setGlobalCounter] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [rating, setRating] = useState({});

  const [questionIdx, setQuestionIdx] = useState(0);
  const [showRateModal, setShowRateModal] = useState(false);
  const [HideIndexes, setHideIndexes] = useState([]);
  const [timerSeconds, setTImerSeconds] = useState(questionTime);
  const [showResearch, setShowResearch] = useState(false);
  const [stats, setStats] = useState({
    numberOfQuestions: 0,
    numberOfAnsweredQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    fiftyFiftyUsed: 0,
    userRate: [],
    globalRate: [],
    hintsUsed: 0,
  });

  function QuizName() {
    const urlSplit = window.location.href.split("/");
    const questionSet = urlSplit[urlSplit.length - 1];
    switch (questionSet) {
      case "Python":
        return "Python";
        break;
      case "Data":
        return "Data Structure ";
        break;
      case "OOP":
        return "OOP";
        break;
      case "Operation":
        return "Operation Systems";
        break;
      case "Linux":
        return "Linux";
        break;
      case "General":
        return "General Questions";
        break;
        return "Quiz";
    }
  }

  // const question = questions[questionIdx]
  const [loading, setLoading] = useState(true);

  async function loadRating() {
    if (!question) return;
    const res = await props.getRating(question.id);
    const payload = res.payload;
    setRating(payload ?? null);
    setLoading(false);
  }
  // The function checks if a research question should be presented to the user
  function countUserRate(ratePrecent, globalRate) {
    setCounter((counter) => counter + 1);
    setUserCount((userRateCount) => userRateCount + ratePrecent);
    setGlobalCounter((globalRateCounter) => globalRateCounter + globalRate);

    //After 3 questions a check is made if the user rated the questions lower than their overall rating
    if (counter == counterLimit ) {
      setCounter((counter) => 0);
      setCounterLimit(((counterLimit) => counterLimit === 5 ? 5 : counterLimit + 1))
      if (userRateCount < globalRateCounter) {
        setUserCount((userRateCount) => 0);
        setGlobalCounter((globalRateCounter) => 0);
        return true;
      }
    }
    return false;
  }
  async function onRate(rate) {
    const userRate = [...props.rate.userRate] ?? [];
    userRate.push({
      rate: rate,
      userEmail: props.user.email,
    });
    const ratesCount = props.rate.ratesCount;
    const ratesSum = props.rate.ratesSum;
    console.log(`rate =>`, rate);
    console.log("ratesCount =>", ratesCount);
    console.log("ratesSum =>", ratesSum);
    console.log(`newRatesCount: ${ratesCount ? ratesCount + 1 : 1}`);

    const newRate = {
      questionId: question.id,
      userRate: userRate,
      ratesCount: ratesCount ? ratesCount + 1 : 1,
      ratesSum: ratesSum ? ratesSum + rate : rate,
    };
    console.log("newRate => ", newRate);

    // Check motivation
    const ratePercent = (rate / 5) * 100;
    stats.userRate.push(ratePercent);
    const globalRatePercent =
      (props.rate.ratesSum / (props.rate.ratesCount * 5)) * 100;
    stats.globalRate.push(globalRatePercent);

    setTimeout(() => {
      // RateStars has some bug that prepregate the event so it fix it
      setShowRateModal(false);
    }, 100);

    //if (ratePercent && globalRatePercent && ratePercent < globalRatePercent) {
    if (countUserRate(ratePercent, globalRatePercent)) {
      setShowResearch(true);
    }
    if (ratesCount !== null && ratesSum) {
      // update
      const res = await props.updateRating(newRate);
    } else {
      // create
      const res = await props.addRating(newRate);
    }
  }

  async function loadSortedQuestions() {
    const questions = loadQuestions(questionSet);
    const ratings = await Promise.all(
      questions.map(async (q) => {
        const id = q.id;
        const res = await props.getRating(id);
        const payload = res.payload;
        const ratesCount = payload?.ratesCount || 0;
        const ratesSum = payload?.ratesSum || 0;

        const ratePercent =
          ratesSum <= 0 ? 0 : (ratesSum / (ratesCount * 5)) * 100;
        return { ratePercent: ratePercent, id: id };
      })
    );
    questions.sort((a, b) => {
      const ratingA = ratings.find((r) => r.id === a.id)?.ratePercent || 0;
      const ratingB = ratings.find((r) => r.id === b.id)?.ratePercent || 0;
      return ratingB - ratingA;
    });
    shuffleArrayInChunks(questions, 10);
    return questions;
  }

  async function init() {
    const data = JSON.parse(localStorage.getItem("user"));
    props.getUser(data);
    const questions = await loadSortedQuestions();
    setStats((prev) => ({ ...prev, numberOfQuestions: questions.length }));
    setQuestions(questions);
    setQuestion(questions[questionIdx]);
    setLoading(false);
    console.log(`questions =>`, questions);
  }
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log("stats => ", stats);
    loadRating();
    setHideIndexes([]);
  }, [questionIdx]);

  function onAnswer(result) {
    if (result) {
      // Correct
      setStats((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
      }));
      playSound(sounds.correctNotification);
      toast.success("Correct!", { autoClose: 350, pauseOnHover: false });
    } else {
      // wrong
      setStats((prev) => ({ ...prev, wrongAnswers: prev.wrongAnswers + 1 }));
      playSound(sounds.wrongNotification);
      toast.error("Wrong answer", { autoClose: 350, pauseOnHover: false });
    }

    setStats((prev) => ({
      ...prev,
      numberOfAnsweredQuestions: prev.numberOfAnsweredQuestions + 1,
    }));

    if (questions.length > 0 && questionIdx + 1 >= questions.length) {
      // end game
      endGame({
        ...stats,
        numberOfAnsweredQuestions: stats.numberOfAnsweredQuestions + 1,
      });
      return;
    }
    setQuestionIdx(questionIdx + 1);
    setQuestion(questions[questionIdx + 1]);
    props.getRating(question.id);
    setShowRateModal(true);
  }

  function endGame(stats) {
    navigate("/play/quizSummary", {
      //state: { ...stats, category: questionSet },
      state: { ...stats, category: QuizName()  },
    });
  }

  useEffect(() => {
    // check scores
    // if (questions.length > 0 && (questionIdx + 1 >= questions.length)) { // end
    //     endGame()
    // }
  }, [stats]);

  function onPrev() {
    playSound(sounds.buttonSound);
    setQuestionIdx(questionIdx - 1);
    setQuestion(questions[questionIdx - 1]);
  }
  function onNext() {
    playSound(sounds.buttonSound);
    setQuestionIdx(questionIdx + 1);
    setQuestion(questions[questionIdx + 1]);
  }

  function onQuit() {
    playSound(sounds.buttonSound);
    endGame(stats);
  }

  function calcScore() {
    return parseInt((stats.correctAnswers / stats.numberOfQuestions) * 100);
  }

  function enableHint(n) {
    const answer = questions[questionIdx].answer;
    const answerIdx = questions.findIndex((q) => q.answer === answer);
    const wrongIdxs = ["A", "B", "C", "D"]
      .map((c, i) => {
        const option = question[`option${c}`];
        return option && answer !== option ? i : -1;
      })
      .filter((i) => i > -1);
    setHideIndexes(wrongIdxs.slice(0, n));
  }

  console.log("props.rate => ", props.rate);

  if (loading) {
    return (
      <>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100vw",
            height: "100vh",
            background: "none",
            position: "absolute",
          }}
        >
          <CircularProgress size="5em" sx={{ color: "#54b5df" }} />
        </Stack>

        <Stack className={classnames("bg-blur")}></Stack>
      </>
    );
  }

  return (
    <>
      {showRateModal && <RateModal onSubmit={onRate} />}
      {showResearch && <Resaerch onFinish={() => setShowResearch(false)} />}
      <Stack className={classnames("bg-blur")} />
      <Stack className={classnames("play")}>
        <ToastContainer />
        <Stack className={classnames("game")}>
          <Typography
            className={classnames("title")}
            variant="h3"
            textAlign="center"
          >
            {QuizName()}
          </Typography>

          <Stack direction="row" className={classnames("hints")}>
            <ButtonBase
              onClick={() => {
                setStats((prev) => ({
                  ...prev,
                  hintsUsed: prev.hintsUsed + 1,
                }));
                enableHint(1);
              }}
              className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"
              component="span"
            />
            <Stack direction="column" className={classnames("info")}>
              <Typography>
                {questionIdx + 1} of {questions.length}
              </Typography>
              <div style={{ width: "100%", height: "100px" }}>
                <LinearProgress
                  variant="determinate"
                  value={((questionIdx + 1) / questions.length) * 100}
                  style={{ height: "10px", width: "250px", margin: "auto" }}
                />
              </div>
              <Typography variant="h6">Score: {calcScore()}</Typography>
              {/* <Timer onEnd={() => { }} totalSeconds={timerSeconds} /> */}
            </Stack>
            <ButtonBase
              onClick={() => {
                setStats((prev) => ({
                  ...prev,
                  fiftyFiftyUsed: prev.fiftyFiftyUsed + 1,
                }));
                enableHint(2);
              }}
              className="mdi mdi-set-center mdi-24px lifeline-icon"
              component="span"
            />
          </Stack>
          <Typography variant="h6" className={classnames("question")}>
            {question.question}
          </Typography>
          <div className="answers-container">
            <div className={classnames("answers")}>
              {["A", "B", "C", "D"].map((c, i) => {
                if (HideIndexes.includes(i)) return;
                const option = question[`option${c}`];
                if (!option) return; // don't render
                return (
                  <Stack key={c} className={classnames("answer")}>
                    <ButtonBase
                      onClick={() => {
                        onAnswer(option === question.answer);
                      }}
                      className={classnames("answer-content")}
                    >
                      <Typography className={classnames("answer-text")}>
                        {option}
                      </Typography>
                    </ButtonBase>
                  </Stack>
                );
              })}
            </div>
          </div>
          <Stack direction="row" className={classnames("controls")}>
            <Button
              sx={{
                "&.MuiButton-contained.Mui-disabled": {
                  background: "gray",
                  opacity: 0.5,
                },
              }}
              onClick={onPrev}
              disabled={questionIdx === 0}
              className={classnames("prev-btn")}
              variant="contained"
            >
              Previous
            </Button>
            <Button
              sx={{
                "&.MuiButton-contained.Mui-disabled": {
                  background: "gray",
                  opacity: 0.5,
                },
              }}
              onClick={onNext}
              disabled={questionIdx === questions.length - 1}
              variant="contained"
            >
              Next
            </Button>
            <Button onClick={onQuit} variant="contained">
              Quit
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Play);
