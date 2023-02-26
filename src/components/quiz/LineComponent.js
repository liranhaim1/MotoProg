import React, { Component, Fragment, useEffect, useState } from 'react';
import Chart  from "react-apexcharts";
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';


function LineComponent() {
    const location = useLocation()
    const [state, setState] = useState({
      score: 0,
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hintsUsed: 0,
      userRate: [],
      globalRate: [],
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
          userRate: state.userRate,
          globalRate: state.globalRate,
          fiftyFiftyUsed: state.fiftyFiftyUsed
        });
      }
    }, [])
  const userArr = state.userRate.map(num => Math.round(num / 10) * 10);
  const globalArr = state.globalRate.map(num => Math.round(num / 10) * 10);
  const createLine ={
    options: {
        colors: ["#E91E63", "#FF9800"],
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [],
          labels: {
            show: false,
          },
        },
      },
      series: [
        {
          name: "Users Rating",
          data:  globalArr,
        },
        {
          name: "Your Rating ",
          data: userArr,
        },
        
      ],
    }
  
  return (
    // <div className="App">
    //   <div className="row">
    //     <div className="col-4">
    //       <Chart
    //         options={createLine.options}
    //         series={createLine.series}
    //         type="line"
    //         width="450"
    //       />
    //     </div>  
    //   </div>
    // </div>
    <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={createLine.options}
              series={createLine.series}
              type="bar"
              // width="500"
              height={300}
            />
          </div>
        </div>
      </div>
  );
}

export default LineComponent;

// bar
// line
// area
// radar
// histogram
// scatter
// heatmap