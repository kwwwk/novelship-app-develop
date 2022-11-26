# Novelship Marketplace App

- [Novelship Marketplace App](#novelship-marketplace-app)
  - [Developments](#developments)
  - [CodePush Scripts](#codepush-scripts)
  - [React & Components](#react--components)
    - [How to work on a new Component?](#how-to-work-on-a-new-component)
  - [Styling](#styling)
  - [UI State Management](#ui-state-management)
  - [Server State Management](#server-state-management)
  - [Localization of app](#localization-of-app)
    - [Steps to add a new language in the project](#steps-to-add-a-new-language-in-the-project)
    - [Tagging Terms for translations](#tagging-terms-for-translations)
    - [WorkFlow of Translations](#workflow-of-translations)
  - [API & Data Fetching](#api--data-fetching)
  - [Type Checking](#type-checking)
  - [File Structure](#file-structure)
  - [Assets](#assets)
  - [Code Standards](#code-standards)
  - [Notes](#notes)
  - [Architecture](#architecture)
  - [Others](#others)

<br/>

## Developments

1. Clone this repository to local.

2. Setup Environment and Emulators/Simulators [following this guide](https://reactnative.dev/docs/environment-setup) for your system. Make Sure to Setup

   1. Node
   2. Java
   3. Android Studio with SDKs and AVD
      1. Additionally also install "NDK (Side by side)" from Android Studio > SDK Tools.
   4. Android Env Paths
   5. Intel Virtualization
   6. Watchman

3. Environment Variables: Make a copy of `.env.sample` as `.env`.

4. Local API Server uses a self signed certificate. Connect to the local API server setup according to steps given below for different platforms

   - iOS

     - Run the command `mkcert -CAROOT` in your terminal, this will give you the path to the rootCA.pem certificate. Drag and drop the certificate from the location to your iOS Simulator. Now you should be able to access local API server from your simulator.

   - Android

     - Self signed certificate doesn't work with android emulator. You can either use the Test API Server or setup a tunnel in the API project. In the API repo, set your `TUNNEL_SUBDOMAIN=YOUR_USERNAME-novelship` (`TUNNEL_SUBDOMAIN=vignesh-novelship`) in `.env`. Then run `npm run dev:tunnel` to start a tunnel connection. It will print the tunnel url

5. VSCode is a recommended Code Editor. Install [Recommended VSCode extensions](./.vscode/extensions.json) for a better experience. _(Open Project in VSCode, Go to Extensions, Select show recommended extensions)_

6. Use Scripts from `package.json` to run the build

<br/>

## CodePush Scripts

```sh
# Codepush deployments
appcenter codepush deployment list -a novelship/Novelship.Android -k

# Codepush release
appcenter codepush release-react -a novelship/Novelship.iOS --plist-file "ios/novelship/Info.plist" -d Staging

```

## React & Components

### How to work on a new Component?

Start by creating your component in `app/component`.

- Components must not include their own paddings, margin, shadow, border and position unless they will be always used with those styles. For better reusability, components must not define how their environment is. We can always easily wrap them in a `<Box>` and add the required wrapping styles.
- If the component is going to be used at too many places with multiple conditions. Duplicate it, don't abstract more. [Read more...](https://medium.com/better-programming/when-dry-doesnt-work-go-wet-6befda0444bf)

<br/>

## Styling

- See [Restyle By Shopify](https://github.com/Shopify/restyle)
- Provides support for theming, typography and responsive UI. Inspired by the popular [Styled System Library](https://styled-system.com/)
- Use predefined colors from `app/styles/theme.ts`
- Follow Font & Spacing from `app/styles/theme.ts`
- Font Used is **IBM Plex Sans**. All components must use these fonts
- Do not use fontWeight Property. Use fontFamily with one of the options from `app/styles/theme.ts.Fonts`. Using only fontWeigh will apply the weight on a wrong font.
- Ensure to disable fontscaling when directly using a third party or react native component which directly displays text. We will support fontscaling when we setup responsive font sizes on the app.

<br/>

## UI State Management

- Manage local component state with `React.useState`
- Global State : [Easy Peasy (Redux Wrapper)](https://easy-peasy.now.sh/)
- Import state hooks from `app/store/` only. These have been types setup.

<br/>

## Server State Management

- Query API using React Query.
- React Query has built in hooks for data fetching, caching, mutations, suspense and much more. Read the [docs](https://react-query.tanstack.com/overview) for more info.

<br/>

## Localization of app

We are using Lingui JS for translating our app into local languages.
You can access the documentation for Lingui [here](https://lingui.js.org/)

### Steps to add a new language in the project

1. [Click here](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) to search subtags for the language you want to add
   e.g., You want to add Chinese. Then, your subtag would be zh

2. Once you have found the subtag for the language you want, add it to locales in `.linguirc` file

3. Add the language in language.js in app/services/language.ts

### Tagging Terms for translations

- If you want to tag terms for translation in a react component wrap it inside a "Trans" component.

```
<Trans>Hello</Trans>
```

- Always use `LB` for line breaks imported from `common/constants/index.ts`. Using `\n` directly breaks the sentence after translations.
  https://github.com/lingui/js-lingui/issues/1132

  https://github.com/lingui/js-lingui/issues/1100

- If you want to tag a variable just wrap it with "i18n" and add the text to be translated in translate.js. Before adding something in translate.js, check if the text already exists in the file. also, translations are case sensitive. so "Hello" and "hello" needs to be tagged separately.

```
i18n._(mode)
```

- For adding a term for form fields we add the term directly in translate.js or translate the placeholder/label

### WorkFlow of Translations

1. On every commit on develop branch, terms are extracted automatically and added to your commit.

2. On every push to develop branch, terms tagged for translations are automatically synced to poeditor.com via webhooks.

3. Translations for terms exported can be done by the contributors added to POEditor.

4. Translated terms are automatically fetched and overwritten on every build.

5. If one needs to see translations in development environment, run

```
npm run lingui:import
```

<br/>

## API & Data Fetching

1. `common/api`: Exposes API with all `fetch`, `post`, `put`, `patch` and `remove` methods.
   1. API.fetch takes in the params for filtering, sorting, joining etc as per Backend API specs.
   2. API.fetch also works for external APIs.

<br/>

## Type Checking

- Project is ready to use typescript.
  - [Typescript Docs](https://www.typescriptlang.org/docs/handbook/basic-types.html)
  - [Typescript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example)

<br/>

## File Structure

- `/app/components`: base reusable components
- `/app/config`: base configurations
- `/app/hooks`: app hooks or native only hooks
- `/app/navigation`: Navigation routes and stacks
- `/app/services`: services/integrations, like `utils` but are non functional
- `/app/store`: Global state store and controllers
- `/app/styles`: base style configs
- `assets/`: Assets to be bundled with app
- `/common/api`: api utils
- `/common/constants`: constants
- `/common/utils`: basic utils, mostly pure functional
- `/types`: common type definitions

<br/>

## Assets

- Image assets must be stored in AWS S3 and proxied with Imgix. If the asset is used appwide or on main components like splash, store it in `/assets`
- Use `auto=format,compress` for all imgix image query. `compress` can be dropped for some cases
- Display responsive images: [Imgix React Native Guide](https://support.imgix.com/hc/en-us/articles/360039259332-Using-imgix-in-React-Native?mobile_site=true)
- Create React Native SVGs [React SVGR](https://react-svgr.com/playground/?native=true&typescript=true)
  <br/>

## Code Standards

- Prettier + Eslint
- Auto Prettify on commit

<br/>

## Notes

- Currency Utils Usage:
  - Use `useCurrencyUtils` Hook when using Currency Utils inside React Components.
  - Use `utils/currency` functions elsewhere.
  - By default it uses `currentCurrency` as currency

<br/>

## Architecture

| Level | Name                        | Phase    | Tool     | Why                                           | For      |
| ----- | --------------------------- | -------- | -------- | --------------------------------------------- | -------- |
| 1     | OTA updates                 | To setup | Expo     | Quick OTA Updates                             | All      |
| 2     | Performance and Crashlytics | To setup | Firebase | Tracking performance, crashes and live errors | SRE Team |

<br/>

## Others

- Install recommended Code editor [extensions](./.vscode/extensions.json)
- Only use NPM and not Yarn to manage packages.

<br/>
