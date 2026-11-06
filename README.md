# Digital-QA-Mobile-Automation-Template

Template project for cross-platform (iOS + Android) **native** mobile app test automation, using **WebdriverIO + Appium + TypeScript** — the mobile equivalent of [Digital-QA-Playwright-project-template](../Digital-QA-Playwright-project-template) for web.

## :green_book: Why this stack

* Your team already writes TypeScript with Playwright. WebdriverIO's test runner looks and feels similar (`describe`/`it`, an `expect` assertion library, a single config file, Allure reporting) so the learning curve is mostly "new locator strategies and capabilities," not "new language."
* **Playwright itself cannot drive native iOS/Android apps** — it only automates browsers (including mobile *web*, via emulation). For a native Kotlin/Android app and a native Swift/SwiftUI iOS app, you need a real device automation protocol, which is what Appium provides.
* Appium is the de-facto standard, works identically for Android (UiAutomator2 driver) and iOS (XCUITest driver), and is what BrowserStack App Automate (and every other device cloud) expects.

## :open_file_folder: Structure

```
Digital-QA-Mobile-Automation-Template/
├── ci/
│   └── Jenkinsfile                     # Android + iOS lanes, optional BrowserStack stage
└── ProjectName_Mobile_Tests/           # rename this per app, same as the Playwright template
    ├── apps/                           # drop local .apk / .app / .ipa builds here (gitignored)
    ├── e2e/
    │   ├── page-objects/               # *.po.ts — one class per screen
    │   ├── tests/smoke/                # *.spec.ts
    │   └── utils/                      # env, app-under-test, screenshot helpers
    ├── scripts/
    │   └── upload-to-browserstack.ts   # one-off app upload to App Automate
    ├── wdio.conf/
    │   ├── wdio.shared.conf.ts         # common settings all other configs extend
    │   ├── wdio.android.local.conf.ts  # local emulator
    │   ├── wdio.android.ci.conf.ts     # Jenkins, local emulator
    │   ├── wdio.android.browserstack.conf.ts
    │   ├── wdio.ios.local.conf.ts      # local simulator
    │   ├── wdio.ios.ci.conf.ts         # Jenkins, local simulator (needs a macOS agent)
    │   └── wdio.ios.browserstack.conf.ts
    ├── .env.example
    └── package.json
```

## :warning: App under test strategy (read this first)

TestFlight and the Firebase App Tester app are **human distribution channels** — they let a person install a build on their own device, but there's no supported way for Appium to pull a build "from TestFlight" or "from Firebase" automatically. The framework supports two ways around this (set via `APP_SOURCE` in `.env`):

1. **`APP_SOURCE=file`** — Appium installs a binary you point it at (`ANDROID_APP_PATH` / `IOS_APP_PATH`). Use this for day-to-day/CI runs: have your own build produce a debug/test `.apk` or a simulator `.app` directly (`./gradlew assembleDebug`, `xcodebuild -sdk iphonesimulator`), independent of what gets shipped to TestFlight/Firebase for human testers. This is what `wdio.*.local.conf.ts` and `wdio.*.ci.conf.ts` are set up for.
2. **`APP_SOURCE=installed`** — a human has already installed the actual release candidate via TestFlight (iOS) or the Firebase App Tester app (Android) on a **real device**, and Appium just attaches to it by `appium:bundleId` / `appium:appPackage`+`appium:appActivity`, without reinstalling anything. Use this for release-candidate validation on a real device you control.

BrowserStack is a third case: it's a cloud of devices with no access to TestFlight/Firebase at all, so it always needs its own uploaded copy of the binary (`npm run upload:browserstack:android` / `:ios` → paste the resulting `bs://...` id into `.env`). You can upload the same `.ipa`/`.apk` you also distribute via TestFlight/Firebase — just get it onto disk first (from your CI build artifacts, not from TestFlight/Firebase itself).

## :white_check_mark: Prerequisites

* Node.js + npm (already installed if you're doing Playwright work)
* **Android**: Android Studio, an SDK platform + at least one AVD created, `ANDROID_HOME`/`ANDROID_SDK_ROOT` set, hardware acceleration enabled for the emulator
* **iOS**: a Mac with Xcode + Command Line Tools, at least one simulator runtime installed
* `npx appium-doctor --android` / `--ios` — run these after setup, fix everything they flag before writing tests
* A BrowserStack App Automate username + access key (you said you already have a subscription)

## :rocket: Getting started

```bash
cd ProjectName_Mobile_Tests
npm install
npm run appium:setup          # installs the UiAutomator2 + XCUITest Appium drivers
cp .env.example .env          # then fill in the values for your app
```

Place a build in `./apps` (or set `APP_SOURCE=installed` if testing an already-installed device), then:

```bash
npm run test:android:local    # needs an emulator already booted
npm run test:ios:local        # needs a simulator already booted (Mac only)
```

Reports: `npm run report:generate && npm run report:open` (Allure).

## :mag: Finding selectors

Use the [Appium Inspector](https://github.com/appium/appium-inspector) against a running Appium session to explore the real app's element tree and pick accessibility ids / resource ids. The sample page objects in `e2e/page-objects` use `~` (accessibility id) selectors and are placeholders — swap in your app's real ones.

The single biggest thing that will save you rewrite effort: **ask your Android and iOS dev teams to set the same accessibility identifier string on equivalent elements** (`contentDescription` in Kotlin/XML, `accessibilityIdentifier` in SwiftUI). If they do, one spec file and one page object work for both platforms. If they don't (or can't, for some screens), branch per platform inside the page object using `driver.isAndroid` / `driver.isIOS` — there's a commented example in `login.po.ts`.

## :cloud: BrowserStack (limited minutes — use deliberately)

`wdio.android.browserstack.conf.ts` / `wdio.ios.browserstack.conf.ts` are kept separate from the local/CI configs on purpose, so nobody accidentally burns the plan's allocated time running everyday checks there. Reach for them for:

* Pre-release regression on real devices / OS versions you don't have locally
* One-off reproduction of a device-specific bug

Not for: routine CI runs or local dev-loop testing — use the local emulator/simulator configs for those.

## :repeat: CI/CD (Jenkins)

`ci/Jenkinsfile` runs Android and iOS as parallel stages against **local emulators/simulators** (not BrowserStack), matching how you said you want CI set up. It needs:

* A Jenkins agent labeled `android-emulator` with the Android SDK and a pre-created AVD (works on Linux or macOS; needs KVM/HAXM for emulator performance)
* A Jenkins agent labeled `macos-ios-simulator` — **this must be a Mac**; iOS simulators cannot run on Linux/Windows agents
* The [Allure Jenkins plugin](https://plugins.jenkins.io/allure-jenkins-plugin/) for the report publishing step
* A `browserstack-app-automate` Jenkins credential (username + access key) **only if** you ever tick the optional `RUN_BROWSERSTACK_REGRESSION` build parameter

You'll need to adjust the two `sh` lines in each stage that reference `$ANDROID_AVD_NAME` / `$IOS_SIMULATOR_UDID` and however the app binary lands in `./apps` for your actual app's build pipeline — this template can't know those specifics yet.

## :triangular_flag_on_post: What's still app-specific (not in this template yet)

* Real selectors/page objects for your actual app's screens (placeholders are in `e2e/page-objects`)
* The actual `.apk` / simulator `.app` build step wired into Jenkins for your app's repo
* Agreeing the accessibility-id convention with the Android/iOS dev teams
* Deciding your real device/OS coverage matrix for the BrowserStack regression suite
* Test data / environment strategy for whichever backend environment the app under test talks to

## :book: Reference

* [WebdriverIO docs](https://webdriver.io/)
* [Appium docs](https://appium.io/)
* [Appium Inspector](https://github.com/appium/appium-inspector)
* [BrowserStack App Automate docs](https://www.browserstack.com/docs/app-automate)
