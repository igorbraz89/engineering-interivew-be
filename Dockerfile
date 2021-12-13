# Build Deps
FROM node:16.8.0-alpine3.12 as nodejs
RUN apk add --no-cache python3 make g++
RUN apk add --upgrade apk-tools>2.10.7-r0

FROM nodejs as build

# Environment
USER node
WORKDIR /home/node
ENV NODE_ENV=production
ENV SKIP_PREFLIGHT_CHECK=true

# Dependencies
COPY --chown=node:node ./.yarn ./.yarn
COPY --chown=node:node .yarnrc.yml package.json yarn.lock ./

RUN yarn --immutable --inline-builds

# App source
COPY --chown=node:node ./ ./

# Bundle app source
RUN yarn build

# Production
FROM nodejs as prod
USER node
WORKDIR /home/node
ENV NODE_ENV=production
ENV NODE_PATH=./

COPY --from=build /home/node/build /home/node/
COPY --from=build /home/node/src/bin/ /home/node/bin/

COPY --from=build /home/node/node_modules/ /home/node/node_modules/

EXPOSE 3001

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \
 CMD ./node_modules/.bin/ts-node ./bin/run-healthcheck.ts

CMD [ "node", "index.js" ]
