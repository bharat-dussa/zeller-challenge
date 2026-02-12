# Zeller FE

![Tests](https://github.com/bharat-dussa/zeller-challenge/actions/workflows/tests.yml/badge.svg)
![Coverage](https://codecov.io/gh/bharat-dussa/zeller-challenge/branch/main/graph/badge.svg)

React Native app with offline-first data flow. GraphQL is used only as a remote sync source, while Realm is the single source of truth.

## Note there are two folder structure

for centralized arch approach 
```sh 
git checkout main
```
for feature based arch approach 

```sh 
git checkout feature-based-arch
```

## Developed screens


<img width="280" height="600" alt="simulator_screenshot_24F88F55-3D74-48CD-9ED0-95C275B009F9" src="https://github.com/user-attachments/assets/cbabb2f1-6c8a-40cc-ae00-d7934f37ef33"/>

<img width="280" height="600" alt="simulator_screenshot_EB158F18-E77D-483B-A97F-254F48B90217" src="https://github.com/user-attachments/assets/b2dc055d-019e-4e26-a5f7-32990670248a" />
<img  width="280" height="600" alt="simulator_screenshot_1A77475C-F021-4CAE-BC17-89F6D248B6DA" src="https://github.com/user-attachments/assets/5faed8e1-08bb-4815-a906-e3277f3c8174" />
<img  width="280" height="600" alt="simulator_screenshot_02119C41-4B3A-4471-A94D-A6C659F6D3E6" src="https://github.com/user-attachments/assets/1aca1a3f-dd0f-4cdc-8810-3a3e376a7924" />
<img width="280" height="600" alt="simulator_screenshot_7D518008-9243-4DD3-AB07-45D7B9D8070F" src="https://github.com/user-attachments/assets/d8aba064-914d-47c3-a313-7528a3085dc2" />
<img width="280" height="600" alt="simulator_screenshot_17644C5F-7C55-42BB-9E19-DDAC88DC1199" src="https://github.com/user-attachments/assets/fd4236dc-bfb0-454c-a618-924ccc056069" />

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
