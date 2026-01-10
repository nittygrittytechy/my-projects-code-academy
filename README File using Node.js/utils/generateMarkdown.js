// utils/generateMarkdown.js (Unsolved Starter)

// TODO: Create helper functions for handling the license section of the README.
// You will likely need:
// - A function that returns a license badge based on which license is passed in
// - A function that returns a license link for the Table of Contents
// - A function that returns the license section text
//
// If there is no license (e.g., the user selects "None"), these helpers should
// return an empty string so that nothing is displayed in the README for license.

// Example stubs:
//
function renderLicenseBadge(license) {
  if (license === 'None') {
    return '';
  }
    // Create badge URL - these are from shields.io
    const licenseName = license.replace(/ /g, '%20');
    return `![License](https://img.shields.io/badge/license-${licenseName}-blue.svg)`;
  }
function renderLicenseLink(license) {
  if (license === 'None') {
    return '';
  }
  return `* [License](#license)`;
}

function renderLicenseSection(license) {
  if (license === 'None') {
    return '';
  }
  
  return `## License

This project for Code Bootcamp is licensed under the ${license} license.`;
}

// TODO: Complete this function to generate the README markdown string
// using the data collected from inquirer.
// The generated README should include sections for:
//
// - Title
// - License badge (if any)
// - Description
// - Table of Contents
// - Installation
// - Usage
// - License (if any)
// - Contributing
// - Tests
// - Questions (GitHub + email)
//
// Use the acceptance criteria and the professional README guide as a reference.

function generateMarkdown(data) {
  // TODO: Use template literals to build the README.md content.
  // Hint: You can call your license helper functions here.
   
  return `# ${data.title}

<!-- TODO: Add license badge here -->
${renderLicenseBadge(data.license)}

## Description

${data.description}

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
${renderLicenseLink(data.license)}
* [Contributing](#contributing)
* [Tests](#tests)
* [GitHub](#github)
* [Email](#email)
* [Extras](#extras)

## Installation

${data.installation}

## Usage

${data.usage}

${renderLicenseSection(data.license)}

## Contributing

${data.contributing}

## Tests

${data.tests}

## GitHub

GitHub: [${data.github}](https://github.com/${data.github})

## Email

Email: ${data.email}

## Extras

${data.extras}

`;
}

// TODO: Export the generateMarkdown function so index.js can use it.
module.exports = generateMarkdown;
