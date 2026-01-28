# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV REACT_APP_AUTH_API_URL=http://138.68.4.47:30001/api/v1
ENV REACT_APP_CAPTURE_API_URL=http://138.68.4.47:30002
ENV REACT_APP_TOKEN_API_URL=http://138.68.4.47:30004
RUN npm run build

# Runtime stage
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
