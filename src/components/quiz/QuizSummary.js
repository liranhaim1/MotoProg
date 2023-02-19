import React, { Component, Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import ChartComponent from "./ChartComponent";
import LineComponent from "./LineComponent";
import { addHistory } from "../../features/history";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../store";

function QuizSummary(props) {
  console.log("props", props);

  const location = useLocation();
  const userId = props.user.id;
  console.log("userId => ", userId);
  const [state, setState] = useState({
    score: 0,
    numberOfQuestions: 0,
    numberOfAnsweredQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hintsUsed: 0,
    userRate: [],
    fiftyFiftyUsed: 0,
  });

  useEffect(() => {
    const { state } = location;
    if (state) {
      const score = (state.correctAnswers / state.numberOfQuestions) * 100;
      setState({
        score: score,
        numberOfQuestions: state.numberOfQuestions,
        numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
        correctAnswers: state.correctAnswers,
        wrongAnswers: state.wrongAnswers,
        hintsUsed: state.hintsUsed,
        userRate: state.userRate,
        fiftyFiftyUsed: state.fiftyFiftyUsed,
      });

      if (userId) {
        addHistory(
          userId,
          new Date(),
          state.category ?? "unknown",
          score,
          state.correctAnswers,
          state.wrongAnswers,
          state.userRate,
          state.globalRate,
          state.fiftyFiftyUsed,
          state.hintsUsed
        );
      }
    }
  }, []);
  console.log(`userRate check`, state.userRate);

  let stats, remark;
  const userScore = state.score;

  if (userScore <= 30) {
    remark = "You need more practice!";
  } else if (userScore > 30 && userScore <= 50) {
    remark = "Better luck next time!";
  } else if (userScore <= 70 && userScore > 50) {
    remark = "You can do better!";
  } else if (userScore >= 71 && userScore <= 84) {
    remark = "You did great!";
  } else {
    remark = "You're an absolute genius!";
  }

  if (state !== undefined) {
    stats = (
      <Fragment>
        <div style={{ textAlign: "center" }}>
          <span className="mdi mdi-check-circle-outline success-icon"></span>
        </div>
        <h1>Quiz has ended</h1>
        <div className="container stats">
          <h2>{remark}</h2>
          <h2>Your Score: {state.score.toFixed(0)}&#37;</h2>
          <ChartComponent />
          <LineComponent />

          <span className="stat left">Total number of questions: </span>
          <span className="right">{state.numberOfQuestions}</span>
          <br />

          <span className="stat left">Number of attempted questions: </span>
          <span className="right">{state.numberOfAnsweredQuestions}</span>
          <br />
          <span className="stat left">Hints Used: </span>
          <span className="right">{state.hintsUsed}</span>
          <br />

          <span className="stat left">50-50 Used: </span>
          <span className="right">{state.fiftyFiftyUsed}</span>
        </div>
        <section>
          <ul>
            <li>
              <Link to="/play/category">Play Again</Link>
            </li>
            <li>
              <Link to="/play/history">Game History</Link>
            </li>
            <li>
              <Link to="/">Back to Home</Link>
            </li>
          </ul>
        </section>
      </Fragment>
    );
  } else {
    stats = (
      <section>
        <h1 className="no-stats">No Statistics Available</h1>
        <ul>
          <li>
            <Link to="/play/quiz">Take a Quiz</Link>
          </li>
          <li>
            <Link to="/">Back to Home</Link>
          </li>
        </ul>
      </section>
    );
  }
  return (
    <Fragment>
      <Helmet>
        <title>Quiz App - Summary</title>
      </Helmet>
      <div className="bg-blur" />
      <div className="quiz-summary">{stats}</div>
    </Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizSummary);
