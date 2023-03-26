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


### Refactor File Contents

Prompts containing "refactor" will expect a file to refactor.


You can reference a file in-line

```
You: can you refactor ./app.js for me?
```

or when prompted

```
You: can you refactor some code for me?

Enter a reference to a local file: ./app.js
```

### Describe File Contents

Prompts containing "explain" or "describe" will expect a file to describe.

You can reference a file in-line

```
You: can you describe ./app.js to me?
```

or when prompted

```
You: can you explain some code to me?

Enter a reference to a local file: ./app.js
```

### Code Comments

Adding code comments is also supported. 

```
You: can you add code comments to ./app.js for me?
```

## Built With

- [OpenAI](https://openai.com/) - The API used
- [Node.js](https://nodejs.org/en/) - The runtime environment used

## Contributors

- **Andrew Milam** - [ammilam](https://github.com/ammilam)