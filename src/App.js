import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Play from "./components/quiz/Play";
import ResearchForm from "./components/quiz/Research";
import QuizSummary from "./components/quiz/QuizSummary";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Category from "./components/quiz/Category";
import { setUser } from "./features/users";
import { useDispatch } from "react-redux";
import LineComponent from "./components/quiz/LineComponent";
import QuizHistory from "./components/quiz/QuizHistory";
//import NewQuizSummary from './components/quiz/newQuizSummary';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const datas = JSON.parse(localStorage.getItem("user"));
    if (datas) {
      dispatch(setUser(datas));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/play/quiz" element={<Play />} />
        <Route path="/play/Python" element={<Play />} />
        <Route path="/play/Data" element={<Play />} />
        <Route path="/play/Operation" element={<Play />} />
        <Route path="/play/Linux" element={<Play />} />
        <Route path="/play/OOP" element={<Play />} />
        <Route path="/play/General" element={<Play />} />

        <Route path="/play/category" element={<Category />} />
        <Route path="/play/research" element={<ResearchForm />} />
        <Route path="/play/quizSummary" element={<QuizSummary />} />
        <Route path="/play/history" element={<QuizHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
