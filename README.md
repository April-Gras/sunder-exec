# sunder-exec
![](https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/84/84207be4c0db5dd637023062494a50781a9653af_full.jpg)

## What it does
- Reads from a config file what directory it is allowed to read
- Presents available scripts from said dirctories in a responsive web app
- Can launch said scripts remotly on your local network

## Configuration
```cp sunder-exec-config.template.json sunder-exec-config.json```
Then use your text editor of choice to fill the config accordingly

#### Available options
```typescript
interface config {
  // An array of the directory you want to expose to the frontend
  // The server will read them and find any file matching the file extentions you configured
  targetDirectories: string[]
  // An object representing what program should be used to launch what type of files
  // Key is `.extentionName` value is the path to the program or just the shell command name
  extentionMapping: Record<`.${string}`, string>
  // The default program when a file has no extentions
  "noExtentionExec": null | string
}
```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```
