import { ESLint } from 'eslint'
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'
import typescriptParser from '@typescript-eslint/parser'
import astroParser from 'astro-eslint-parser'

export default [
  // Configuración global para TypeScript
  {
    languageOptions: {
      parser: typescriptParser, // Parser para TypeScript
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json', // Asegúrate de tener el archivo tsconfig.json
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Agregar reglas específicas para TypeScript aquí
    },
  },
  // Configuración específica para archivos .astro
  {
    files: ['*.astro'],
    languageOptions: {
      parser: astroParser, // Parser para archivos Astro
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      astro: eslintPluginAstro,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Agregar reglas específicas para Astro aquí
    },
  },
]
