# openai-cli

This is a simple cli chatbot that uses the OpenAI GPT-3 API to generate responses to user inputs. It can also generate code refactors based on user prompts.

## Getting Started

### Prerequisites

- Node.js
- OpenAI API key

### Usage

#### 1. Download Executable From Latest Release

Download an executable from the latest [release](https://github.com/ammilam/openai-cli/releases/tag/latest).

#### 2. Authenticate

Set your OpenAI API key to environment variable, pass it in as an argument, or enter it when prompted.

```bash
# as environment variable
OPENAI_API_KEY=<your OpenAI API key>

# as a flag
./openai-cli* --api_key=<your OpenAI API key>

# if an api key is not passed like above, the tool will prompt for it
Please enter your OpenAI API key:
```

#### 3. Run the tool

```bash
./openai-cli*
```

## Prompts

The cli tool will respond to certain prompts differently than normal dialogue.

### Refactor File Contents

Prompts containing "refactor" will expect a file to refactor.

You can reference a file in-line

```bash
You: can you refactor ./app.js for me?
```

or when prompted

```bash
You: can you refactor some code for me?

Enter a reference to a local file: ./app.js
```

### Describe File Contents

Prompts containing "explain" or "describe" will expect a file to describe.

You can reference a file in-line

```bash
You: can you describe ./app.js to me?
```

or when prompted

```bash
You: can you explain some code to me?

Enter a reference to a local file: ./app.js
```

### Code Comments

Adding code comments is also supported.

```bash
You: can you add code comments to ./app.js for me?
```

### Write Solutions

The tool can also use OpenAI to write completely new files.

```bash
You: can you write an example kubernetes image pull secret for me?
```

### Debug Code

Code can also be debugged

```bash
You: can you help me debug hello.py?
```

### Running In Automation

If you want to run this script via automation, you can do so by using the following command:

```bash
./openai-cli* --run_in_ci --input_file=<input_file_path> --output_file=<output_file_path> --action=refactor
```

### Running In Docker

In order to run in a container,

```bash
# run the container
 docker run -it \
  --volume $PWD:/mount \
  --env OPENAI_API_KEY=<your OpenAI API key> \
  --env INPUT_FILE=/mount/app.js \
  --env RUN_IN_CI=true \
  --env ACTION=describe \
  ghcr.io/ammilam/openai-cli:latest

  ```

### Running From Source

#### Install dependencies

```bash
npm install
```

#### Run the script

```bash
node app.js
```

## Built With

- [OpenAI](https://openai.com/) - The API used
- [Node.js](https://nodejs.org/en/) - The runtime environment used

## Contributors

- **Andrew Milam** - [ammilam](https://github.com/ammilam)
