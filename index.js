const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 8081;
const axios = require("axios");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.post("/getQuestions", async (req, res) => {
  try {
    const {API_URL} = req.body;
    const {data} = await axios.get(API_URL);
    
    const formattedQuestions = data.results.map((q) => {
      return {
        question: q.question,
        choices: [...q.incorrect_answers, q.correct_answer],
      };
    });
    res.status(200).json(formattedQuestions);
  } catch (error) {
    res.status(403).json({ message: "something went wrong" });
  }
});

app.post("/checkAnswers", async (req, res) => {
  try {
    const { API_URL, userAnswers } = req.body;
    let count = 0;
    const {data} = await axios.get(API_URL);
    const questions = data.results;
    userAnswers.forEach((userAnswer, index) => {
      if (userAnswer === questions[index].correct_answer) {
        count++;
      }
    });
    console.log(userAnswers);
    console.log(count);
    const scorePercentage= ((count / questions.length) * 100).toFixed(2)
    res.status(200).json({ score: count, questionsWithAnswers:questions,scorePercentage: scorePercentage });
  } catch (error) {}
});

app.listen(PORT, () => {
  console.log("Server is up..");
});
