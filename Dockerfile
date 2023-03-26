FROM alpine:latest
RUN /bin/sh -c "apk add --no-cache bash git jq"
RUN exec /bin/bash
RUN wget https://github.com/ammilam/openai-cli/releases/download/latest/openai-cli-alpine-x64
RUN mv openai-cli-alpine-x64 openai-cli
RUN chmod +x openai-cli
ENTRYPOINT [ "./openai-cli" ]