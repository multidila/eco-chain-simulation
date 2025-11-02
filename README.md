# EcoChain Simulation

EcoChain Simulation is an Angular SPA that visualizes a digital ecosystem consisting of plants, herbivores, and predators. The project uses standalone Angular components, Jest for unit testing, and Husky + lint-staged to keep the codebase healthy.

## Prerequisites

- Node.js `>= 20.17.0`
- npm `>= 10.8.2`

Check your versions with:

```bash
node --version
npm --version
```

## Getting Started

```bash
npm install
npm run start:dev    # http://localhost:4200/
```

- `start:dev` runs `ng serve --configuration=development`
- `start:prod` runs the server using the production configuration

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run start` | Alias for `ng serve` using the default (development) config |
| `npm run start:dev` / `npm run start:prod` | Serve with explicit dev / prod configuration |
| `npm run build` | Build with the default configuration |
| `npm run build:dev` / `npm run build:prod` | Build with explicit dev / prod configuration |
| `npm run test` | Run Jest once in watch-less mode |
| `npm run test:watch` | Watch mode for Jest |
| `npm run test:coverage` | Create a coverage report (`coverage/`) |
| `npm run test:ci` | CI-friendly Jest run with coverage and limited workers |
| `npm run test:clear-cache` | Clear the Jest cache |
| `npm run lint` | ESLint check (fails on warnings) |
| `npm run lint:fix` | ESLint with auto-fix enabled |
| `npm run format` / `npm run format:check` | Prettier write / check |

Husky hooks run lint-staged on staged files before commit, applying Prettier and ESLint fixes automatically.

## Testing Stack

- **Jest + ts-jest** for unit tests (`setup-jest.ts` configures the Angular TestBed).
- **jest-preset-angular** provides Angular test utilities.
- **ng-mocks** assists with mocking Angular dependencies.

Logs from `console.warn` are suppressed during tests, and browser-specific APIs such as `ResizeObserver` are mocked globally.

## Formatting & Linting

- **ESLint** enforces code quality (Angular + RxJS + Jest rules).
- **Prettier** handles formatting (tabs, 120 char line width, strict HTML whitespace sensitivity).
- `.editorconfig` defines default tabbed indentation, with dedicated overrides for YAML/Dockerfiles (`2` spaces).

## Build Output

Production builds are emitted to `dist/eco-chain-simulation`. The app uses SCSS stylesheets and treats `.css`/`.scss` as side effects to ensure global styles are preserved during bundling.

## Git Hooks

- **pre-commit**: Runs lint-staged (`prettier --write`, `eslint --fix`) and records status.
- **commit-msg**: Reruns lint checks if the previous step reported unresolved errors.

Hooks can be reinstalled at any time with `npm run prepare`.

## Troubleshooting

- Ensure you have enough Node heap (set in `.npmrc` via `node-options=--max-old-space-size=8096`).
- If Jest reports cache-related issues, run `npm run test:clear-cache` followed by `npm test`.
- On dependency conflicts, reinstall with `npm install --legacy-peer-deps` (also configured in `.npmrc`).
