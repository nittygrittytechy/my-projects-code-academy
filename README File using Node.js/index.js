// 02-Challenge — Professional README Generator (Unsolved Starter)

// TODO: Import the required packages:
// - fs for writing files
// - inquirer for collecting user input
// - the generateMarkdown function from ./utils/generateMarkdown

const fs = require("fs");
const inquirer = require("inquirer");
const generateMarkdown = require("./utils/generateMarkdown");

// TODO: Create an array of questions for user input.

const questions = [
  // TODO: Add your question objects here

  { 
    type: "input",
    name: "title",
    message: "What is your project title?", 
  },
  { 
    type: "input",
    name: "description",
    message: "What is your project description?", 
  },
  {
    type: "input",
    name: "installation",
    message: "What installation instructions do you have for your project?",
  },
  {
    type: "input",
    name: "usage",
    message: "What is the usage information?",
  },
  {
    type: "input",
    name: "contributing",
    message: "What contribution guidelines do you have for your project?",
  },
  {
    type: "input",
    name: "tests",
    message: "What test instructions do you have for your project?", 
  },
  {
    type: "list",
    name: "license",
    message: "Choose a license for your project:",
    choices: ["MIT", "Apache 2.0", "GPL 3.0", "BSD 3-Clause", "None"],
  },
  {
    type: "input",
    name: "github",
    message: "what is your github username?", 
  },
  {
    type: "input",
    name: "email",
    message: "what is your email?",
  },
  {
    type: "input",
    name: "extras",
    message: "What extras do you want to add for this project?",
  }
];

// TODO: Create a function to write the README file.
// It should take a file name and the data to write.
// Use fs.writeFile or fs.writeFileSync inside this function.

function writeToFile(filename, data) {
  // TODO: Implement this function so it writes "data" to "fileName"
  fs.writeFileSync(filename, data);
  console.log('Success! The README.md was created!');
}

// TODO: Create a function to initialize the app.
// It should prompt the user for the information required to populate the README.
// Use inquirer to collect user input.

function init() {
  // TODO: Implement this function so it asks the user questions
  inquirer
    .prompt(questions)
    .then((answers) => {
      console.log(answers);
      writeToFile("README.md", generateMarkdown(answers));
    })
    .catch(err => console.error("Error:", err));
}

// start the app
init();