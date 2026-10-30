# Base Stage - Installing Dependencies
FROM node:20 AS base-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Test Stage
FROM base-stage AS test-stage
COPY . .
RUN npm test

# Build Stage
FROM test-stage AS build-stage
RUN npm run build

# Final 
FROM nginx:1.29-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html