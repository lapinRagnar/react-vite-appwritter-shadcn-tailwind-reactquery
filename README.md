# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# le tuto
https://www.youtube.com/watch?v=_W3R2VwRyF4
https://gist.github.com/adrianhajdin/4d2500bf5af601bbd9f4f596298d33ac


# 1. setup project
## installation de tailwind css
1- les commandes sont :
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm i tailwindcss-animate
```	
2- configurer le theme dans tailwind.config.js

# 2. routing
## installation de react-router-dom
1- les commandes sont :
```
npm install react-router-dom
```	

# 3. auth pages, form
## shadcn pour créer le formulaire
https://ui.shadcn.com/

1- les commandes sont :
```
npm i -D @types/node
npx shadcn-ui@latest init

```

2- pour intsaller un bouton
```
npx shadcn-ui@latest add button

```	