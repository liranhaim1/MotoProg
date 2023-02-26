import React, { Component, Fragment, useEffect, useState } from 'react';
import Chart  from "react-apexcharts";
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';


function ChartComponent() {
  const location = useLocation()
  const [state, setState] = useState({
    score: 0,
    numberOfQuestions: 0,
    numberOfAnsweredQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hintsUsed: 0,
    fiftyFiftyUsed: 0
  });

  useEffect(() => {
    const { state } = location
    if (state) {
      setState({
        score: state.correctAnswers / state.numberOfQuestions * 100,
        numberOfQuestions: state.numberOfQuestions,
        numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
        correctAnswers: state.correctAnswers,
        wrongAnswers: state.wrongAnswers,
        hintsUsed: state.hintsUsed,
        fiftyFiftyUsed: state.fiftyFiftyUsed
      });
    }
  }, [])
  console.log(state.correctAnswers)

  const chartOptions = {
    options: {},
    series: [state.correctAnswers, state.wrongAnswers,state.hintsUsed + state.fiftyFiftyUsed],
    chartOptions:{
      labels: ['Correct', 'Incorrect', 'Assisted'],
      colors: ["#04FA1B","#FA1A04","#ECFF33"]
    }
  }


  return (
    <Fragment>
      <Helmet><title>Quiz App - Summary</title></Helmet>
      {/* <div style={{ width: '50%', margin: 'auto' }}> */}
        <div className="donut">
          <Chart options={chartOptions.chartOptions} series={chartOptions.series} type="donut" height={250} />
        </div>
      {/* </div> */}
    </Fragment>
  );




}

export default ChartComponent;