## ‘builder’ stage
FROM node:11 as builder

# Storing node modules on a separate layer will prevent unnecessary npm installs at each build
COPY package.json package.json
RUN npm install && mkdir /webapp && mv ./node_modules ./webapp

WORKDIR /webapp
COPY . .

# artifacts goes to build folder
RUN npm run build --prod


## deploy stage
FROM nginx:1.14.1-alpine

# Copy our default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build folder from 'builder' to default nginx public folder
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /webapp/build/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
