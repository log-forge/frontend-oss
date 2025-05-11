FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env

COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# install cross-env to set env vars at runtime
RUN npm install -g cross-env

COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build

ARG VITE_NODE_ENV
ARG VITE_EXPOSED_BACKEND_PORT

ENV VITE_CSRF_COOKIE_SECRET="MB0[Eq}2Us5w;2~?17]3u'1m`}[>1rVYGMpP.Q%UMuewYw5y"
ENV VITE_CSRF_SECRET="isX('<`dxK0£1^=4.<r7];%&u_fgNp41tM;6UmQQ@4RQ'CR&l"
# hardcord value of node env for development image to "development"
ENV VITE_NODE_ENV="development" 
# hardcord value of node env for production image to "production"
# ENV VITE_NODE_ENV="production" 

# Use cross-env to set env and run server
# Add cross-env to pass environment variables dynamically from docker-compose
CMD ["cross-env", "VITE_CSRF_COOKIE_SECRET=$VITE_CSRF_COOKIE_SECRET", "VITE_CSRF_SECRET=$VITE_CSRF_SECRET", "VITE_NODE_ENV=$VITE_NODE_ENV", "npm", "run", "start"]
