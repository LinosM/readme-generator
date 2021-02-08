// Packages needed for this application
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const gen = require("./utils/generateMarkdown");

// Prevents user for leaving blank answers to certain inquirer prompts
const validateAnswer = async (input) => {
  if (input === '') {
    return "Error, this prompt is required"
  } else {
    return true;
  }
}

// Series of questions for the user
const userPrompt = () =>
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter project title',
        validate: validateAnswer
      },
      {
        type: 'input',
        name: 'desc',
        message: 'Enter description',
        validate: validateAnswer
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter your full name',
        validate: validateAnswer
      },
      {
        type: 'input',
        name: 'inst',
        message: 'Enter installation instructions (optional)',
      },
      {
        type: 'input',
        name: 'usage',
        message: 'Enter the usage (optional)',
      },
      {
        type: 'input',
        name: 'contrib',
        message: 'Enter any contributors (optional)',
      },
      {
        type: 'input',
        name: 'test',
        message: 'Enter any testing instructions (optional)',
      },
      {
        type: 'list',
        name: 'lic',
        message: 'Choose a license for the application',
        choices: ["MIT", "GNU GPLv3", "Apache License 2.0", "ISC", ]
      },
      {
        type: 'input',
        name: 'username',
        message: 'Enter your GitHub username',
        validate: validateAnswer
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email address',
        validate: validateAnswer
      }
  ])

// Creates the Readme and License file
const writeToFile = (data) => {
  // Takes user input to generate readme/license text
  const readme = gen.generateMarkdown(data);

  // Checks if folder exists and makes one if it does not
  if (!fs.existsSync('./_export')) {
    fs.mkdirSync(path.join(__dirname, '_export'), (err) => { 
      if (err) { 
          return console.error(err); 
      } 
    });
  }

  fs.writeFile('./_export/README.md', readme, (err) =>
  err ? console.error(err) : console.log('README generated inside _export folder'));

  fs.writeFile(`./_export/${gen.getLicName(data.lic)}`, gen.renderLicenseFile(data), (err) =>
  err ? console.error(err) : console.log('License generated inside _export folder'));
}

const init = () => 
    userPrompt().then((response) => {
        try {
            writeToFile(response);
        } catch (err) {
            console.log(err);
        }
    });

// Function call to initialize app
init();

