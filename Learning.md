# Learning Guide (1-Day Sprint)

This guide is tuned to the current feature-based structure and test suite. Use it as a 1‑day cram to understand the codebase, the testing approach, and the React Native animation patterns used here.

## 1. Project Structure (Feature-Based)

High-level layout:

- `src/app`
  - App wiring and providers (Realm, navigation)
- `src/features/users`
  - User feature screens, components, hooks, logic, and validation
- `src/shared`
  - Shared UI, utilities, data services, and models used across features

Why this scales:

- Features are isolated (easy to add `features/payments`, `features/reports`, etc.)
- Shared primitives and services stay centralized
- App shell (navigation, providers) remains thin

## 2. Test Strategy Overview

This repo uses Jest + React Test Renderer. Most tests are **unit tests** with lightweight mocks so behavior is deterministic.

Core ideas:

- UI components are rendered in isolation and user events are simulated.
- Hooks are tested by rendering a small “HookTester” component.
- API and data services are mocked to avoid network/Realm dependencies.

## 3. Tests You Should Know (Explained)

Below is a quick description of **each test file** and what you learn from it.

### App and Navigation

1. `__tests__/App.test.tsx`
   - Purpose: ensure the app renders once config is ready.
   - Key concept: async effect (`useEffect`) resolved before rendering the navigator.

2. `__tests__/src/navigation/root-navigator/root-navigator.test.tsx`
   - Purpose: smoke test for the navigation stack.
   - Key concept: `RootNavigator` renders without crashing.

### Realm Provider

3. `__tests__/src/context/realm-service.context.test.tsx`
   - Purpose: verifies provider behavior and `useRealmService` error handling.
   - Key concept: provider returns `null` before Realm is available, then exposes service.

### Users Feature

4. `__tests__/src/hooks/use-users.hook.test.ts`
   - Purpose: tests the data flow of `useUsers`.
   - Validates:
     - Users are fetched on mount
     - Errors are handled
     - Refresh path updates state

5. `__tests__/src/screens/user-list/user-list.screen.test.tsx`
   - Purpose: UI behavior for list screen.
   - Validates:
     - Loader shown when loading
     - No-data state when search empty
     - Tab press changes list, add button navigates

6. `__tests__/src/screens/add-user/add-user.screen.test.tsx`
   - Purpose: screen wrapper renders without crashing.
   - Simple sanity test for screen composition.

7. `__tests__/src/components/add-user.component.test.tsx`
   - Purpose: verifies Add User form behavior.
   - Validates:
     - Default values in create/edit mode
     - Validation errors disable save
     - Create/update/delete logic calls Realm service

8. `__tests__/src/components/user-list.component.test.tsx`
   - Purpose: verifies list rendering and navigation.
   - Validates:
     - Section headers
     - Admin badge
     - On-press navigation to edit user

### Shared Components

9. `__tests__/src/components/tab-bar.component.test.tsx`
   - Purpose: verifies tab bar behavior.
   - Validates:
     - Missing animated index throws
     - Tab presses update index
     - Search toggle clears query

10. `__tests__/src/components/loader.component.test.tsx`
    - Purpose: loader renders the expected text.

11. `__tests__/src/components/no-data.component.test.tsx`
    - Purpose: no-data text renders.

12. `__tests__/src/components/floating-button.component.test.tsx`
    - Purpose: press events are wired.

13. `__tests__/src/components/app-button.component.test.tsx`
    - Purpose: button renders and handles press.

14. `__tests__/src/components/icons/close.icon.test.tsx`
    - Purpose: CloseIcon renders SVG.

15. `__tests__/src/components/icons/search.icon.test.tsx`
    - Purpose: SearchIcon renders SVG.

### Shared Utils + Services

16. `__tests__/src/utils/common.test.ts`
    - Purpose: tests list section building + constants.

17. `__tests__/src/utils/color.util.test.ts`
    - Purpose: colors export sanity check.

18. `__tests__/src/utils/route.test.ts`
    - Purpose: route constants exist.

19. `__tests__/src/utils/types.test.ts`
    - Purpose: type module can be imported.

20. `__tests__/src/db/realConfig.test.ts`
    - Purpose: Realm config is created with encryption key.

21. `__tests__/src/db/secureKey.test.ts`
    - Purpose: ensures secure key generation path works.

22. `__tests__/src/db/schemas/index.test.ts`
    - Purpose: schema exports list.

23. `__tests__/src/db/schemas/user.schemas.test.ts`
    - Purpose: user schema exists and exports properly.

24. `__tests__/src/services/api/users/user.api.test.ts`
    - Purpose: API wrapper returns items and handles missing items.

25. `__tests__/src/services/api/users/user.logic.test.ts`
    - Purpose: filtering, searching, and mapping logic behaves correctly.

26. `__tests__/src/services/api/users/user.models.test.ts`
    - Purpose: ensures user model module loads.

27. `__tests__/src/services/api/graphqlClient.test.ts`
    - Purpose: GraphQL client exports correctly.

28. `__tests__/src/services/graphql/queries.test.ts`
    - Purpose: queries export sanity check.

29. `__tests__/src/services/graphql/types.test.ts`
    - Purpose: GraphQL type definitions importable.

## 4. Animation Concepts (Quick Interview Prep)

This app uses `react-native-reanimated` (see `src/shared/components/tab-bar.component.tsx`). You should be able to explain:

- **SharedValue**: mutable value stored on the UI thread (`useSharedValue`).
- **useAnimatedStyle**: returns a style object that reacts to `SharedValue` updates.
- **withTiming**: animates a value over time with easing.
- **interpolate / interpolateColor**: maps input ranges to output values or colors.

Example explanation:

- The tab indicator moves by changing `animatedIndex.value`. When index changes, `withTiming` animates translation.
- Search mode toggles by changing `searchProgress.value` (0 → 1), then animated opacity and translation to show/hide tabs or input.

## 5. 1-Day Study Plan

1. Morning: Read structure + key files
   - `App.tsx`, `src/app/navigation/root-navigator.tsx`
   - `src/features/users/screens/user-list.screen.tsx`
   - `src/features/users/components/add-user.component.tsx`

2. Midday: Read tests for those files
   - Match each test to real code.

3. Afternoon: Read `useUsers` hook + `user.logic`
   - Understand filtering and syncing flow.

4. Evening: Animation + reanimated concepts
   - Walk through `tab-bar.component.tsx` and explain in plain language.

## 6. Quick Interview Talking Points

- “The app is structured by feature so we can scale to new domains without entangling shared layers.”
- “Shared services and models keep domain logic reusable and testable.”
- “Most tests are unit tests with mocks; hooks and UI are verified via React Test Renderer.”
- “Animations use Reanimated’s shared values to run smoothly on the UI thread.”

