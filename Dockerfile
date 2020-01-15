## ‘builder’ stage
FROM node:12 as builder

# Storing node modules on a separate layer will prevent unnecessary npm installs at each build
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn && mkdir /webapp && mv ./node_modules ./webapp

# RUN npm i expo-cli

WORKDIR /webapp
COPY . .

# artifacts goes to build folder
RUN yarn build


## deploy stage
FROM nginx:1.14.1-alpine

# Copy our default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build folder from 'builder' to default nginx public folder
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /webapp/web-build/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
