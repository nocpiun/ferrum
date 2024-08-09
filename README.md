<div align="center">

<img src="./public/icon.png" style="width:82px;"/>

# Ferrum Explorer

[![Author](https://img.shields.io/badge/Author-NriotHrreion-red.svg "Author")](https://github.com/NriotHrreion)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg "LICENSE")](./LICENSE)
[![Stars](https://img.shields.io/github/stars/nocpiun/ferrum.svg?label=Stars)](https://github.com/nocpiun/ferrum/stargazers)
[![test](https://img.shields.io/github/actions/workflow/status/nocpiun/ferrum/ci.yml)](https://github.com/nocpiun/ferrum/actions/workflows/ci.yml)

> Explore throughout your server

</div>

## Description

Ferrum Explorer is a web-based file explorer app for servers.

Because it's only maintained by me, so it might have some problems and bugs. You can raise an issue or create a pull request to tell me or fix it.

#### Why its name is Ferrum?

```
File Explorer -> FE -> Fe (Chemical Element) -> Ferrum
```

## Deploy & Use

First, you need to make sure that your server (or computer) has installed Nodejs.

1. Download and install

```bash
git clone https://github.com/nocpiun/ferrum.git
cd ferrum
npm i
npm run patch
npm run build
```

2. Prepare the `.pwd` file

Rename the `.pwd.example` to `.pwd` in the project root folder. This file stores your access key to Ferrum. The default password is `123456`, and you can change your password in the settings.

```txt
PASSWORD=....
```

3. Run the app (Recommended to use Administrator privilege)

```bash
npm run start
```

4. Enter `http://localhost:3300`.

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

Ferrum Explorer requires ports `3300` to launch. If you see it reports `address already in use :::xxxx`, you should have a check to whether you've launched Ferrum Explorer and whether other apps are using the ports. And see the following steps.

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

## Contributing

Contributions to Ferrum Explorer are welcomed. You can fork this project and start your contributing. If you don't know how to do, please follow the instruction [Creating a Pull Request from a Fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

I'll check the Pull Request list in my spare time. I can't make sure that every Pull Request will be seen by me at once.

## Scripts

An explanation of the `package.json` scripts.

- **`start`** Launch the app in production mode
- **`dev`** Launch the app in development mode
- **`patch`** Install `next-ws` plugin
- **`build`** Create a production build
- **`build:ci`** Create a production build for CI environment
- **`lint`** Run ESLint

## LICENSE

[MIT](./LICENSE)
