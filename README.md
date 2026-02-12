# Zeller FE

![Tests](https://github.com/bharat-dussa/zeller-challenge/actions/workflows/tests.yml/badge.svg)
![Coverage](https://codecov.io/gh/bharat-dussa/zeller-challenge/branch/main/graph/badge.svg)

React Native app with offline-first data flow. GraphQL is used only as a remote sync source, while Realm is the single source of truth.

## Run The App

1. Install dependencies

```sh
# Using Yarn
yarn

# Or npm
npm install
```

2. Start Metro

```sh
yarn start
```

3. Run on device/simulator

```sh
# Android
yarn android

# iOS
yarn ios
```

## Build For Release

### Android (APK)

```sh
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Android (AAB)

```sh
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS (Archive)

Use Xcode:

1. Open `ios/zellerfe.xcworkspace`
2. Select the `zellerfe` scheme
3. Product -> Archive

Or via command line (update scheme if needed):

```sh
cd ios
xcodebuild -workspace zellerfe.xcworkspace -scheme zellerfe -configuration Release -archivePath build/zellerfe.xcarchive archive
```

## Tests

```sh
yarn test --runInBand
```

Latest run: **32 test suites, 62 tests passed**.

CI runs tests with coverage on every push and pull request. Coverage reports are uploaded to Codecov.

## Packages Used

Core dependencies:

- React, React Native
- React Navigation (native + native-stack)
- Realm + @realm/react
- GraphQL + graphql-request
- React Hook Form + Zod
- react-native-safe-area-context
- react-native-reanimated
- react-native-pager-view
- react-native-svg
- uuid

Dev/testing:

- @testing-library/react-native
- TypeScript
- ESLint + Prettier

## Package Justification

- React + React Native: Standard cross-platform UI/runtime with strong ecosystem and native performance.
- React Navigation: Clear navigation contracts and platform-consistent transitions.
- Realm + @realm/react: Local-first persistence, fast queries, and reactive data for offline workflows.
- GraphQL + graphql-request: Lightweight client for server sync without heavy runtime overhead.
- React Hook Form + Zod: Schema-driven validation with minimal re-render overhead.
- react-native-safe-area-context: Correct layout on modern devices (notches, status bars).
- react-native-reanimated: UI-thread animations for smooth, jank-free interactions.
- react-native-pager-view: Native paging for performant, swipeable lists.
- react-native-svg: Scalable icons and vector assets.
- uuid: Consistent client-side IDs for offline creates and reconciliation.

## Optimizations

- Offline-first architecture with Realm as source of truth.
- Minimal network dependency: GraphQL only for sync.
- Memoized list shaping via `useMemo` in `use-users.hook.ts`.
- Shared UI components to reduce rerenders and duplication.
- Animated tab indicator and search transition powered by Reanimated to keep interactions smooth under load.

Future optimization opportunities:

- Add pagination/infinite scroll for large datasets.
- Introduce background sync with retry/backoff and conflict resolution policies.
- Precompute sectioned lists in Realm or memoize with stable selectors to reduce recompute churn.
- Add list virtualization tuning (windowing, item layout hints) for lower memory footprint.

## Environment Setup

See the official React Native environment guide:

```
https://reactnative.dev/docs/environment-setup
```
