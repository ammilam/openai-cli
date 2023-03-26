# openai-cli
This is a simple chatbot that uses the OpenAI GPT-3 API to generate responses to user inputs. It can also generate code refactors based on user prompts.

## Getting Started

### Prerequisites

- Node.js
- OpenAI API key

### Installing

1. Install dependencies

```
npm install
```

2. Set your OpenAI API key in your .env file or pass it as an argument to the script

```
OPENAI_API_KEY=<your OpenAI API key>
```

3. Run the script

```
node app.js
```

## Using Prebuilt Executable 

1. Download the prebuilt executable for your operating system

2. Set your OpenAI API key in your .env file or pass it as an argument to the script

```
OPENAI_API_KEY=<your OpenAI API key>
```

3. Run the binary

```
./openai-cli*
```

## Prompts

The cli tool will respond to certain prompts differently than normal dialogue.

### Refactor

Prompts containing "refactor" or "code comments" will expect a file containing code to refactor or describe

```
You: can you refactor ./app.js for me?
```

### Explain

Prompts containing "explain" or "describe" will expect a file containing code to explain.

```
You: can you describe ./app.js to me?
```

## Built With

- [OpenAI](https://openai.com/) - The API used
- [Node.js](https://nodejs.org/en/) - The runtime environment used

## Contributors

- **Andrew Milam** - ammilam
