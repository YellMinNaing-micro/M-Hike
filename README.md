# M-Hike

A React Native + Expo mobile app built with Expo Router, Gluestack UI, Tailwind/Nativewind, and several supporting packages for navigation, storage, animation, and accessibility.

This README explains the main packages used, the high-level app flow/architecture, how to set up and run the project, and a few tips for development.

---

## Tech stack & packages used

This project is built on Expo with React and React Native. Key dependencies (from M-Hike/package.json) and their roles:

- Core
  - `expo` — Expo SDK (app platform)
  - `react` / `react-dom` / `react-native` — React and React Native
  - `expo-router` — file-based routing for Expo apps (entry point: `expo-router/entry`)

- Navigation
  - `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `@react-navigation/elements` — navigation primitives and stacks/tabs

- UI & Styling
  - `@gluestack-ui/core`, `@gluestack-ui/themed`, `@gluestack-ui/config`, `@gluestack-style/react`, `@gluestack-ui/utils` — Gluestack UI components and style system
  - `nativewind`, `tailwindcss`, `tailwind-variants` — Tailwind-style utilities for React Native; utility-first styling
  - `@expo/html-elements` — additional HTML-like elements for Expo apps
  - `@expo/vector-icons`, `react-native-svg` — icons and SVG support

- Accessibility & UI State
  - `react-aria`, `react-stately`, `@react-native-aria/{button,focus,overlays}` — accessibility primitives and state hooks

- Storage & Data
  - `@react-native-async-storage/async-storage` — key/value storage for small data
  - `expo-sqlite` — local relational storage (SQLite) for structured data persistence

- Inputs & Native UI
  - `@react-native-picker/picker`, `@react-native-community/datetimepicker` — native pickers and date/time input

- Media, Assets & System
  - `expo-image`, `expo-font`, `expo-constants`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-system-ui`, `expo-web-browser`, `expo-symbols`

- Gestures & Animations
  - `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets` — gestures and performant animations
  - `@legendapp/motion` — declarative motion/animation library

- Build / Tooling
  - `babel-plugin-module-resolver` — custom module path aliases
  - `tailwindcss` — tailwind CLI/config for styles
  - Dev dependencies: `typescript`, `eslint`, `eslint-config-expo`, `@types/react`

---

## How the app flows (architecture overview)

- Entry point:
  - The app uses `expo-router` as the main entry (`expo-router/entry`) and leverages file-based routing. Pages/screens are exposed by the router directory structure.

- Navigation:
  - Screen routing is primarily handled by expo-router (filesystem-based). Native navigation stacks and bottom tabs from `@react-navigation` are used where explicit stacks or tab bars are needed.

- UI & Styling:
  - UI components are built with Gluestack UI for component primitives and theming. Styling utilities from `nativewind`/`tailwindcss` are used for quick layout and utility classes. Icons and SVGs are provided by `@expo/vector-icons` and `react-native-svg`.

- Accessibility & State:
  - Interactive components use `react-aria` and `react-stately` hooks for consistent accessible behavior across components (focus management, overlays, button semantics).

- Local data:
  - App-level small key/value state and caches use `@react-native-async-storage/async-storage`.
  - Structured or relational data (e.g., hikes, route logs, records) use `expo-sqlite` for persistent local storage.

- Animations & gestures:
  - Smooth interactions use `react-native-reanimated`, `react-native-gesture-handler` and `@legendapp/motion` for declarative motion.

- Typical runtime flow:
  1. App launches via Expo Router entry.
  2. Router resolves initial route/component (e.g., splash → auth or main tabs).
  3. UI rendered using Gluestack and Tailwind utilities.
  4. Data is read from SQLite / AsyncStorage as needed; screens dispatch changes that are persisted.
  5. Navigation between screens uses router + native stacks/tabs; overlays and accessible modals managed by react-aria overlays.

---

## Setup & run

Prerequisites:
- Node.js (recommend current LTS, e.g. >= 18)
- Yarn or npm
- Expo CLI (optional): `npm install -g expo-cli` or use `npx expo`

Install:
```bash
git clone https://github.com/YellMinNaing-micro/M-Hike.git
cd M-Hike/M-Hike
# using npm
npm install
# or using yarn
yarn
```

Run app:
- Start Expo dev server:
  - npm: `npm run start`
  - or `expo start`
- Run on device/emulator:
  - Android: `npm run android` (opens in Expo Go or runs on emulator)
  - iOS: `npm run ios`
  - Web: `npm run web`

Other scripts:
- `npm run reset-project` — custom reset script included at `./scripts/reset-project.js`
- `npm run lint` — run linter (eslint)

Notes about native modules:
- If you use bare native builds or EAS, ensure you configure native dependencies per their docs (reanimated, gesture handler, etc). For Expo Managed workflow they generally work with the SDK versions specified in package.json.

---

## Development tips & troubleshooting

- Reanimated: Make sure Babel plugin and Reanimated setup in `babel.config.js` are correct and the Reanimated plugin is the last plugin as required in the docs.
- Pod install (iOS, bare workflow): run `npx pod-install` after adding native deps.
- SQLite DB: Provide a small wrapper for your queries and migrations. Check `expo-sqlite` docs for concurrency and transaction usage.
- Reset / clean: If state or cache issues occur, use the `reset-project` script or clear Expo caches: `expo start -c`.
- Tailwind / nativewind: Ensure `tailwind.config.js` is configured and the nativewind plugin is installed and loaded properly.
- TypeScript: Types are provided via `@types/react` and `typescript` dev dependency.
