# Scroll Menu Example

Playground app for `@sekizlipenguen/react-native-scroll-menu`.

Tracked in git for local development / MCP tests, but **not published to npm**
(root `package.json` `files` + `.npmignore`).

## Setup

```bash
cd example
npm install
bundle install
bundle exec pod install --project-directory=ios
```

## Run (iOS)

Prefer a free Metro port (8082 may already be taken by another project):

```bash
# terminal 1
npm start -- --port 8083

# terminal 2
npx react-native run-ios --udid "$(xcrun simctl list devices booted | sed -nE 's/.*\(([A-F0-9-]+)\).*/\1/p' | head -1)" --port 8083
```

The app covers: basic selection, autoCenter, ref scroll APIs, upperCase, disabled,
per-item `onPress`, custom `component`, indicator + gap, `unstyled`, and `renderItem`.
