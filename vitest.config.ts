import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom', // <-- обязательно укажите jsdom
    globals: true,         // если хотите глобально describe, it, expect, vi
    setupFiles: ['./src/setupTests.ts'], // если используете файл для первоначальной настройки
  }
});
