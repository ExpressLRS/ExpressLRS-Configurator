# ExpressLRS Configurator

ExpressLRS Configurator is a cross-platform build & configuration tool for the
[ExpressLRS](https://github.com/AlessandroAU/ExpressLRS) - open source RC link for RC applications.

## Need help? Confused? Join the Community!

- [RCGroups Discussion](https://www.rcgroups.com/forums/showthread.php?3437865-ExpressLRS-DIY-LoRa-based-race-optimized-RC-link-system)
- [Discord Chat](https://discord.gg/dS6ReFY)
- [Facebook Group](https://www.facebook.com/groups/636441730280366)

## Architecture

```
 - - - - - - - - - - - - - - - - - - - -
|          ExpressLRS-Configurator      |
|                   |                   |
|     renderer      |        main       |
|                   |                   |
|   configurator <----->  api-server    |
|                   |          |        |
|                   |          V        |
|                   |      platformio   |
|_ _ _ _ _ _ _ _ _ _|_ _ _ _ _ | _ _ _ _|
                               V
                      ExpressLRS hardware
```

This Electron application is split into two parts: a local API server that does all the work, and a UI layer. Both of
these application layers communicate within each other using Graphql protocol.

Heavy use of TypeScript and `@graphql-codegen/cli` is made throughout the repository to ensure the datatypes transmitted
between the API and UI layers are consistent at compile-time and Graphql ensuring the datatypes are consistent at
runtime.

## Starting Development

Prerequisites

- node >=14.0
- git >= 2.25
- python >= 3.6
- platformio >= 5.0

Start the app in the dev environment:

```bash
yarn install --frozen-lockfile
yarn start
```

## Other useful cli commands

Generate TypeScript types from Graphql schema and Queries located in [src/ui/gql/queries](src/ui/gql/queries):

```bash
yarn run gql-codegen
```

## Credits

- [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
