# Application Overview

## Get Started

Prerequisites:

-   Node 14+

To set up react-app-base execute the following commands in your terminal

---

```bash
git clone git@github.com:preacher2041/react-app-base.git
cd react-app-base
cp .env.example .env
npm i
```

---

React-App-Base uses mockoon to mock API calls, to start the Mockoon cli service run the following commands in your terminal

##### `npm install -g @mockoon/cli`

##### `mockoon-cli start --data ~/path/to/your-environment-file.json`

For more information about this service, or to use their desktop application, check here, [Mockoon](https://mockoon.com/)

---

##### `npm run dev`

Runs the app in development mode.
Open [http://localhost:9000](http://localhost:9000) to view it in the browser

---

##### `npm build`

Builds the app for production to the `build` folder\
It will automatically bundle the application for production mode and optimize it for the best performance.

For more information see the official React documentation about [deployment](https://facebook.github.io/create-react-app/docs/deployment)

---

## Table Of Contents:

-   [Application Overview](docs/application-overview.md)
-   [Project Configuration](docs/project-configuration.md)
-   [Code Style Guide](docs/code-style-guide.md)
-   [Project Structure](docs/project-structure.md)
-   [Components And Styling](docs/components-and-styling.md)
-   [API Layer](docs/api-layer.md)
-   [State Management](docs/state-management.md)
-   [Testing](docs/testing.md)
-   [Error Handling](docs/error-handling.md)
-   [Security](docs/security.md)
-   [Performance](docs/performance.md)
