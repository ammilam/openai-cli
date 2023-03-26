// Importing necessary packages
const { Configuration, OpenAIApi } = require("openai");
const prompt = require('prompt-sync')({ sigint: true });

const multiLinePrompt = ask => {
  // Function to prompt user for multi-line input
  const lines = ask.split(/\r?\n/);
  const promptLine = lines.pop();
  console.log(lines.join('\n'));
  return prompt(promptLine);
};

// Initializing variables to store API key
let question;
require("dotenv").config();
const yargs = require("yargs");

// for when this is ran in automation
const runInAutomation = process.env.RUN_IN_CI || yargs.argv.run_in_ci
const inputFile = process.env.INPUT_FILE || yargs.argv.input_file
const outputFile = yargs.argv.output_file || process.env.OUTPUT_FILE;
const type = process.env.ACTION || yargs.argv.action;
console.log(runInAutomation)
// Check if type is provided when running in automation
if (runInAutomation && !type) {
  console.log("You must specify a type of action when running in automation.");
  console.log("Valid actions are: refactor, describe, code-comments, debug")
  process.exit(1);
}

// Check if action is valid
if (runInAutomation && !["refactor", "describe", "code-comments", "debug"].includes(type)) {
  console.log("Please provide a valid action when running in automation.");
  console.log("Valid actions are: refactor")
  process.exit(1);
}

// Check if input and output files are provided when executing refactor action while running in automation
if (runInAutomation && type === "refactor" && (!inputFile || !outputFile)) {
  console.log("You must specify an input file and an output file when refactoring or adding code comments to code while running in automation.");
  process.exit(1);
}

// Check if input file is provided when executing code-comments action while running in automation
if (runInAutomation && type === "code-comments" && !inputFile) {
  console.log("You must specify an input file when adding code comments to code while running in automation.");
  process.exit(1);
}

const yargsApiKey = yargs.argv.api_key || "";
const envApiKey = process.env.OPENAI_API_KEY || "";

// Checking for API key in different sources
let apiKey = yargsApiKey != "" ? yargsApiKey : envApiKey;

// Prompt the user for the API key if it is not set
if (!apiKey && !runInAutomation) {
  question = multiLinePrompt("Please enter your OpenAI API key: ");
  apiKey = question;
}

// Checking if API key was successfully obtained
if (!apiKey) {
  console.log(
    "No API key found. Please set an API key in your .env file or pass it as an argument to the script."
  );
  process.exit(1);
}

// Initializing OpenAI API with obtained API key
const configuration = new Configuration({
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

// Function to prompt the OpenAI GPT-3 model and obtain a response
async function promptGpt(question) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: question }],
  });
  let response = await completion.data.choices[0].message.content;
  return response;
}

// Importing necessary package to read and write files
const fs = require("fs");

// Main chat function that prompts user and generates responses using GPT-3 model
async function chat() {
  let action;

  if (runInAutomation) {
    let inputFileContents = fs.readFileSync(inputFile, "utf8");
    action = type;
    switch (action) {
      case "refactor":
        question = "can you help me refactor the following code?" + " " + inputFileContents;
        break;
      case "describe":
        question = "can you help describe the following code to me?" + " " + inputFileContents;
        break;
      case "code-comments":
        question = "can you help me add code comments to the following code?" + " " + inputFileContents;
        break;
      case "debug":
        question = "can you help me debug the following code?" + " " + inputFileContents;
        break;
    }
  } else {
    // Prompting for user input
    question = multiLinePrompt("You: ");

    // Exiting chat if user input indicates they want to end the conversation
    if (question.match(/[Bb]ye|[Ee]xit|[Cc]lose|[Ss]ee [Yy]a|[Ff]uck [Oo]ff|[Nn]o [Th]anks/)) {
      return;
    }

    const refactorPattern = /[Rr]efactor|[Cc]ode comment/;
    const describePattern = /[Dd]escribe|[Ee]xplain/;
    const debugPattern = /[Dd]ebug|[Ff]ix/;
    const writePattern = /[Ww]rite|[Cc]reate|[Gg]enerate/;

    if (refactorPattern.test(question)) {
      action = "refactor";
    } else if (describePattern.test(question)) {
      action = "describe";
    } else if (debugPattern.test(question)) {
      action = "debug";
    } else if (writePattern.test(question)) {
      action = "write";
    } else {
      action = "dialogue";
    }
  }
  // Checking what type of file processing the user wants
  if (["refactor", "debug", "describe"].includes(action) && !runInAutomation) {
    const fileRegex = /.([a-zA-Z0-9_\-\/\\]+\.([a-zA-Z0-9_\-]+))/g;
    // Checking if a file reference was included in user input, otherwise prompt user for reference
    let file = fileRegex.test(question) ? question.match(fileRegex)[0] : multiLinePrompt("Enter a relative path to a local file: ");

    const pathRegex = /(\.\/|\.\\|\.\.\/|\.\.\\|\/|\\)([a-zA-Z0-9_\-\/\\]+\.([a-zA-Z0-9_\-]+))/g;
    if (!pathRegex.test(file)) {
      // If file lacks path, prompt user for path
      let path = multiLinePrompt("Enter a relative path to the file: ");
      file = path;
    }
    console.log(`reading file ${file}`);

    let fileContents = fs.readFileSync(file, "utf8");
    // Appending file contents to the original user prompt to generate a more detailed request
    question = question + " " + fileContents;
  }

  // Generating response using GPT-3 model
  let response = await promptGpt(question);

  if (runInAutomation && ["describe", "debug"].includes(action)) {
    console.log(response)
    process.exit(0);
  } else {
    console.log("Bot: " + response);
  }

  // If a code refactor was requested, prompt user for file output and write refactored code to file
  if (["refactor", "code-comments", "write"].includes(action)) {
    let writeToFile = !runInAutomation ? multiLinePrompt("Do you want to write the refactored code to a file? (y/n): ") : "yes"
    if (writeToFile.match(/[Yy]es|[Yy]/)) {
      fileName = runInAutomation ? outputFile : multiLinePrompt("Enter a file name: ");
      fs.writeFileSync(fileName, response);
      console.log(`Bot: I refactored your code. Check out the ${fileName} file.`);
      if (runInAutomation) {
        process.exit(0);
      }
    }
  }

  // Continue the chat by recursively calling the function
  chat();
}

// Starting the chat
chat();