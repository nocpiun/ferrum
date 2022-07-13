# `src`

> This is where the source code of Ferrum is.

## Folders

- **`client`** The frontend client source code (React & ES6)
- **`icons`** The icon files
- **`plugins`** The plugins
- **`server`** The backend server source code (Node.js)
- **`test`** The test files (Jest)

## Note

The `client` and the `server` are the major source code folders.

When the app launches, it will run the client and the server concurrently. The frontend not only fetches data from the backend, but also posts data to the backend. In this way, the app can save the user's data (such as the star list), and get the realtime information (such as the system info or the directory info).

By the way, when you run the app in production environment (`npm run start`), the project building program will go first, while the development one (`npm run dev`) doesn't.

Welcome to make contribution to this project!
