// import questions json
import questions from '../assets/questions/questions.json';
import python from '../assets/questions/python.json';
import oop from '../assets/questions/oop.json';
import generalQuestion from '../assets/questions/generalQuestion.json';
import linux from '../assets/questions/linux.json';
import dataStructure from '../assets/questions/dataStructure.json';
import oprationSystem from '../assets/questions/operationSystems.json';

export const options = [
    { value: 7, label: '7' },
    { value: 6, label: '6' },
    { value: 5, label: '5' },
    { value: 4, label: '4' },
    { value: 3, label: '3' },
    { value: 2, label: '2' },
    { value: 1, label: '1' }
]

export const loadQuestions = (questionSet) => {
    switch (questionSet) {
        case "Python": {
            return python
        }
        case "Data": {
            return dataStructure
        }
        case "Operation": {
            return oprationSystem
        }
        case "Linux": {
            return linux
        }
        case "OOP": {
            return oop
        }
        case "General": {
            return generalQuestion
        }
        default: {
            return questions;
        }
    }
}