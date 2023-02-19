import wolf from '../../assets/research/wolf.json';
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import Play from './Play';


const totalQuestion = wolf.categories.length // one from each



const colors = [
  "#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00"
]


function AnswerButton({ answer, answerValue, onClick, sx }) {
  return (
    <ButtonBase onClick={onClick} value={answerValue} sx={sx} className={classnames("answer-button")}>
      <Typography fontWeight="bold" color="white">{answer}</Typography>
    </ButtonBase>
  )
}


function WolfForm({ onFinish }) {
  const [questionIdx, setQuestionIdx] = useState(Math.floor(Math.random(4)))
  const [result, setResult] = useState({})
  const [categoryIdx, setCategoryIdx] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(1)



  const question = wolf.categories[categoryIdx].questions[questionIdx]
  const answers = wolf.answers


  const calcMotive = (result) => {

    const absorption = result.absorption / wolf.answers.length
    const workEnjoyment = result.work_enjoyment / wolf.answers.length
    const intrinisic = result.intrinisic_motivation / wolf.answers.length

    return {
      absorption: absorption * 100,
      workEnjoyment: workEnjoyment * 100,
      intrinisic: intrinisic * 100
    }
  }

  const hasMotive = (calcResult) => {
    return (
      calcResult.absorption >= 18.7 &&
      calcResult.workEnjoyment >= 28.3 &&
      calcResult.intrinisic >= 20.9
    )
  }

  const onAnswerClick = (e) => {
    const answeredValue = parseInt(e.currentTarget.value)
    const newResult = { ...result }
    const category = wolf.categories[categoryIdx]

    if (newResult.hasOwnProperty(category.name)) { // update
      newResult[category.name] += answeredValue 
    } else { // create
      newResult[category.name] = answeredValue
    }
    setResult(newResult)

    if (categoryIdx >= wolf.categories.length - 1) {
      const calcResult = calcMotive(newResult)
      onFinish({ answeres: result, hasMotive: hasMotive(calcResult), result: calcResult })
      return;
    } else {
      setCategoryIdx(categoryIdx + 1) // Next category
      const nextRandom = Math.floor(Math.random() * wolf.categories[categoryIdx].questions.length)
      setQuestionIdx(
        nextRandom
      ) // first question
      setAnsweredCount(answeredCount + 1)
    }
  }

  return (
    <>
      <Stack className={classnames('questions-container')}>
        <Typography sx={{ opacity: 1 }} color="#bdc1c6" variant='h4'>
          Question {answeredCount}/<span style={{ fontSize: "0.6em" }}>{totalQuestion}</span>
        </Typography>
        <Typography color="white" marginTop="25px" variant='h6'>
          {question}
        </Typography>
      </Stack>
      <Stack className={classnames('answers-container')}>
        {
          answers.map((answer, index) => (
            <AnswerButton answerValue={index} key={answer} onClick={onAnswerClick} answer={answer} sx={{ border: `3px solid ${colors[index]}` }} />
          ))
        }
      </Stack>
    </>
  )
}


function LackMotive({ changeCategory, continueQuiz }) {
  return (
    <Stack sx={{
      width: "100%",
      height: "100%",
      // justifyContent: "center",
      // alignItems: "center"

    }}>
      <Typography paddingTop="20px" variant='h5' color="white" textAlign="center">A lack of motivation was detected by the system,</Typography>
      <Typography paddingTop="20px" variant='h5' color="white" textAlign="center"> You have the option to change the category.</Typography>
      <Stack sx={{ gap: "20px", alignItems: "center", marginTop: "40px" }}>
        <AnswerButton
          answer="Change Category"
          sx={{ border: "2px solid #80ff00", width: "40%" }}
          onClick={() => {

            changeCategory()
          }}
        >
        </AnswerButton>
        <AnswerButton answer="Continue"
          onClick={() => {
            continueQuiz()
          }}
          sx={{ border: "2px solid #ffbf00", width: "40%" }}>Continue</AnswerButton>

      </Stack>
    </Stack>
  )
}


function Resaerch({ onFinish }) {
  const [LackofMotive, setLackofMotive] = useState(false)
  const navigate = useNavigate()

  const onFormFinish = (result) => {
    if (!result.hasMotive) {
      setLackofMotive(true)
    } else {
      onFinish()
    }

  }


  return (
    <Stack className={classnames("research-container")}>
      <Typography sx={{ textShadow: "1px 1px 2px #000000" }} textAlign="center" marginTop="40px" variant="h2" color="white"> Wolf Research</Typography>
      
      <Stack justifyContent="center" alignItems="center" sx={{ width: "100%", height: "70%" }}>
        <Stack flexDirection="row" className={classnames('question-container')}>
          {
            LackofMotive ?
              <LackMotive continueQuiz={() => onFinish({ hashMotive: true })} changeCategory={() => {
                navigate("/play/category")
              }} />
              :
              <WolfForm onFinish={onFormFinish} />
          }

        </Stack>
      </Stack>
    </Stack>
  )

}
export default Resaerch;