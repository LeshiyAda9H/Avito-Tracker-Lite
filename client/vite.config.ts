import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Конфигурация Vite для сборки проекта
export default defineConfig({
  plugins: [
    react(), // Плагин для поддержки React (JSX, Fast Refresh)
  ],
});

/*
Предложения по улучшению:
1. **Переменные окружения**: Добавить поддержку переменных окружения для API_URL (например, env для разработки/продакшена).
2. **Оптимизация**: Включить плагины для оптимизации сборки (например, vite-plugin-svgr для SVG или vite-plugin-pwa для PWA).
3. **Прокси**: Настроить прокси для API-запросов (например, server.proxy для /api/v1).
4. **Документация**: Добавить комментарии с ссылкой на документацию Vite для каждого плагина.
*/