## Build the website
FROM node:12-alpine
# FROM node:12 as builder

WORKDIR /webapp

# Should only reinstall npms if package.json or yarn.lock change
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY . .

# Artifacts goes to /build folder
# RUN yarn build

## Use serve:
CMD ["yarn", "serve"]

EXPOSE 5000


## Deploy the website using nginx
# FROM node:12 as builder
# FROM nginx:1.17.7-alpine

# # Copy our default nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Copy build folder from 'builder' to the default nginx public folder
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=builder /webapp/dist/ /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]

# EXPOSE 80