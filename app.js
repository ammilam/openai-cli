// Importing necessary packages
const { Configuration, OpenAIApi } = require("openai");
const prompt = require('prompt-sync')({sigint: true});
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
const yargsApiKey = yargs.argv.OPENAI_API_KEY || "";
const envApiKey = process.env.OPENAI_API_KEY || "";
let apiKey = "";

// Checking for API key in different sources
switch (true) {
  case yargsApiKey != "":
    apiKey = yargsApiKey;
    break;
  case envApiKey != "":
    apiKey = envApiKey;
    break;
  default:
    // If API key is not found, prompt user for input
    question = multiLinePrompt("Please enter your OpenAI API key: ");
    apiKey = question;
    break;
}

// Checking if API key was successfully obtained
if (apiKey == "") {
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

  // Prompting for user input
  question = multiLinePrompt("You: ");

  // Exiting chat if user input indicates they want to end the conversation
  if(question.match(/[Bb]ye|[Ee]xit|[Cc]lose|[Ss]ee [Yy]a|[Ff]uck [Oo]ff|[Nn]o [Th]anks/)) {
    return;
  }
  let action;
  switch (true) {
    case /[Rr]efactor(.*)|[Cc]ode comment(.*)/.test(question):
      action = "refactor";
      break;
    case /[Dd]escribe|[Ee]xplain/.test(question):
      action = "describe";
      break;
    case /[Dd]ebug|[Ff]ix/.test(question):
      action = "debug";
      break;
    case /[Ww]rite|[Cc]reate/.test(question):
      action = "write";
      break;
    default:
      action = "dialogue";
      break;    
  }

  // Checking what type of file processing the user wants
  if(action == "refactor" || action == "debug" || action == "write" || action == "describe") {
    
    const fileRegex = /.([a-zA-Z0-9_\-\/\\]+\.([a-zA-Z0-9_\-]+))/g;
    // Checking if a file reference was included in user input, otherwise prompt user for reference
    let file = fileRegex.test(question) ? question.match(fileRegex)[0] : multiLinePrompt("Enter a relative path to a local file: ");

    // regex to see if file lacks relative or absolute path
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
  console.log("Bot: " + response);

  // If a code refactor was requested, prompt user for file output and write refactored code to file
  if (action == "refactor") {
  let writeToFile = multiLinePrompt("Do you want to write the refactored code to a file? (y/n): ");
    if (writeToFile.match(/[Yy]es|[Yy]/)) {
      fileName = multiLinePrompt("Enter a file name: ");
      fs.writeFileSync(fileName, response);
      console.log(`Bot: I refactored your code. Check out the ${fileName} file.`);
    }
  }

  // Continue the chat by recursively calling the function
  chat();
}

// Starting the chat
chat();