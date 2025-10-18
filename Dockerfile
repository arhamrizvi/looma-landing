# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# In prod we hit the API via the reverse proxy path
ENV VITE_API_URL=/api
RUN npm run build

# ---- serve stage ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf 'server {\n      listen 80;\n      server_name _;\n      root /usr/share/nginx/html;\n      index index.html;\n      location / {\n        try_files $uri /index.html;\n      }\n      add_header X-Content-Type-Options nosniff always;\n      add_header X-Frame-Options SAMEORIGIN always;\n      add_header Referrer-Policy no-referrer-when-downgrade always;\n    }\n' > /etc/nginx/conf.d/default.conf
