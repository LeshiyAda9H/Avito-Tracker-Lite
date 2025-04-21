# client/Dockerfile

# Этап 1: Сборка React-приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package.json package-lock.json ./
RUN npm install

# Копируем весь код приложения
COPY . .

# Собираем приложение для продакшен
RUN npm run build

# Этап 2: Настройка Nginx для раздачи собранного приложения
FROM nginx:alpine

# Копируем собранные файлы из этапа сборки
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx (если нужен, создадим его ниже)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80 для Nginx
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]