<div align="center">

<img src="./public/logo.png" style="width:82px;image-rendering:pixelated;"/>

# Ferrum Explorer

[![Author](https://img.shields.io/badge/Author-NriotHrreion-red.svg "Author")](https://github.com/NriotHrreion)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg "LICENSE")](./LICENSE)
[![Stars](https://img.shields.io/github/stars/NriotHrreion/ferrum.svg?label=Stars)](https://github.com/NriotHrreion/ferrum/stargazers)
[![test](https://img.shields.io/github/workflow/status/NriotHrreion/ferrum/Test%20&%20Deploy)](https://github.com/NriotHrreion/ferrum/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e6af7829-7b1c-47ed-bf14-deb2b2d9648a/deploy-status)](https://app.netlify.com/sites/resonant-kitsune-43a162/deploys)

> Explore throughout your server

English | [中文](./README-zh_CN.md)

</div>

## Description

Ferrum Explorer is a web-based file explorer app for servers.

Because it's only maintained by me, so it has many problems and bugs. You can create a issue or pull request to tell me or fix it.

#### Why its name is Ferrum?

```
File Explorer -> FE -> Fe (Chemical Element) -> Ferrum
```

#### Can I have a look of it?

Demo: https://ferrum-demo.nin.red (The password is `123456`)

## Deploy & Use

First, you need to make sure that your server (or computer) has installed Nodejs.

1. Download and install

```bash
git clone https://github.com/NriotHrreion/ferrum.git
cd ferrum
npm i
```

2. Run the app

```bash
npm run start
```

If you're using Linux, you need to add `sudo` before the command.

3. Enter `http://localhost:3300`, the default password is `123456`.

### To get update

Do the following commands, then do `npm run start`.

```bash
git fetch origin main:temp
git merge temp
npm i
```

If error at `npm i`, just try:

```bash
npm i --legacy-peer-deps
# or
npm i --force
```

### Something to notice

Ferrum Explorer requires ports `3300` `3301` to launch. If you see it reports `address already in use :::xxxx`, you should have a check to whether you've launched Ferrum Explorer and whether other apps are using the ports. And see the following steps.

**Windows**

```bash
netstat -aon | findstr [[here write the port it reported]]
taskkill /f /pid [[here write the PID the above command returned]]
```

**Linux & Mac OS**

```bash
lsof -i:[[here write the port it reported]]
kill -9 [[here write the PID the above command returned]]
```

If it reports `ENOSPC: System limit for number of file watchers reached, watch 'xxx'` and you're using Linux, please do:

```bash
sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p
```

## Plugin

#### Write a Viewer Plugin

Viewer is a page that is shown when the user opens a file. The viewer's page will be shown when the user opens the file format(s) the viewer's option has specified. For example, a video viewer, its page will be shown when the user open a `.mp4` file.

You need to create a new `jsx` file. And a metadata list of the plugin is needed. (The following is a complete example).

```jsx
({
    name: "example-viewer",
    displayName: "Example Viewer",
    setup({ addViewer }) {
        addViewer({
            id: "example-viewer", // The ID of your viewer
            pageTitle: "Example Viewer", // This will be shown on the top of your viewer's page
            route: "/example-viewer", // The route of your viewer's page
            formats: [], // The formats that your viewer supports
            render: (dataUrl) => <div>{dataUrl}</div> // The render of your viewer (`dataUrl` is a base64 data url)
        });
    }
})
```

Then, add your plugin in settings.

## Testing

Ferrum Explorer is using Jest to test code.

```bash
npm run test
```

## Contributing

Contributions to Ferrum Explorer are welcomed. You can fork this project and start your contributing. If you don't know how to do, please follow the instruction [Creating a Pull Request from a Fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

I'll check the Pull Request list in my spare time. I can't make sure that every Pull Request will be seen by me at once.

## Scripts

An explanation of the `package.json` scripts.

- **`start`** Launch the app in production mode
- **`dev`** Launch the app in development mode
- **`server`** Only launch the server
- **`client`** Only launch the client
- **`build`** Create a production build (No using singly)
- **`build:netlify`** Create a production build (For the deployment of Netlify)
- **`test`** Run tests

## Note

> **Fun Fact:** This project learnt a lot from [Takenote](https://github.com/taniarascia/takenote). Takenote is also awesome.

## LICENSE

[MIT](./LICENSE)
