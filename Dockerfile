# ---------------------------------------------------------------------------- #
#                                  Development                                 #
# ---------------------------------------------------------------------------- #
FROM node:18-alpine as development

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate
RUN yarn build

# ---------------------------------------------------------------------------- #
#                                  Production                                  #
# ---------------------------------------------------------------------------- #
FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY . .

COPY --from=development /app/dist ./dist

RUN npx prisma generate

EXPOSE 8000

CMD [ "yarn", "start:prod" ]
