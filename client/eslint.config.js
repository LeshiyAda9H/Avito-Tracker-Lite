import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Конфигурация ESLint для проверки кода
export default tseslint.config(
  // { ignores: ['dist'], // Игнорирование папки сборки },
  {
    extends: [
      js.configs.recommended, // Базовые правила для JavaScript
      ...tseslint.configs.recommended, // Рекомендуемые правила для TypeScript
    ],
    files: ['**/*.{ts,tsx}'], // Применение правил к файлам TypeScript и TSX
    languageOptions: {
      ecmaVersion: 2020, // Поддержка ECMAScript 2020
      globals: globals.browser, // Глобальные переменные браузера
    },
    plugins: {
      'react-hooks': reactHooks, // Плагин для проверки хуков React
      'react-refresh': reactRefresh, // Плагин для React Fast Refresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // Правила для хуков React
      'react-refresh/only-export-components': [
        'warn', // Предупреждение при экспорте некомпонентов
        { allowConstantExport: true }, // Разрешить экспорт констант
      ],
    },
  },
);

/*
Предложения по улучшению:
1. **Дополнительные правила**: Добавить правила для доступности (eslint-plugin-jsx-a11y) и строгой типизации (@typescript-eslint/strict).
2. **Игнорирование**: Расширить ignores для временных файлов (например, node_modules, .cache).
3. **Документация**: Добавить комментарии с описанием каждого плагина и правила.
4. **Кастомизация**: Настроить правила под проект (например, отключить строгие правила для прототипов).
*/