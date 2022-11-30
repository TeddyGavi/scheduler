# Interview Scheduler

Interview Scheduler is a single-page application (SPA) that allows users to book interviews between students and mentors.

The template can be found here: [LHL Scheduler](https://github.com/lighthouse-labs/scheduler)

## Getting Started

- **READ THIS BEFORE ANYTHING ELSE**
- **IF RUNNING IN LOCAL MACHINE ON DEV MODE**

  > You will need to have the API server running to test the full functionality of the App.

  - Follow the instructions listed here: [LHL Scheduler-API](https://github.com/lighthouse-labs/scheduler-api)

- **I have two branches:**
  - _main_, the main project
  - _web_socket:_ - showcasing my solution to the websocket stretch (refactored to separate file to allow for JEST test suite to pass) - This branch also has a refactored version of the spotsRemaining feature
- [Back To Top](#)

### Setup

1. Git clone to repo
2. Navigate to this newly created directory on your local

- Make sure to have the API cloned and running
- configure your local proxies

See Below:

Install dependencies with `npm install`.

### Running Webpack Development Server

```sh
npm start
```

### Running Jest Test Framework

```sh
npm test
```

### Running Storybook Visual Testbed

```sh
npm run storybook
```

- [Back To Top](#)

### Learning Outcomes

- [x] StoryBook
  - Testing components in isolation
  - Pattern recognition and implementation
- [x] React
  - Controlled components
  - useState
  - useEffect --axios, and WebSockets
  - Custom Hooks
  - Immutable Objects and update patterns
  - Parent/child component building
- [x] JSX
  - Component building
  - Understanding Syntax Patterns
  - Passing Props
  - Using [classNames](https://github.com/JedWatson/classnames) for conditional rendering
- [x] Reducer
  - Implement Reducer patterns
  - The difference between Switch and Objects in Reducers
- [x] WebSockets
  - Two browser tabs open will update automatically if one user makes a change, see the view for more
- [Back To Top](#)

### Future Goals

- [ ] write more tests to bring coverage up
- [x] refactor newSpots function to operate independently -_UPDATE NOV:30/22_ Can be viewed on the web-socket branch
  > This completes two state updates after a socket response, see the branch for more
- [ ] add cookie management and login
- [ ] replace the useVisualMode hook with useContext
- [Back To Top](#)

### Views

Websocket Demo
![Demo of Websockets](./docs/WebSocket-Demo.gif)

Regular Use
![Regular use](./docs/Regular_use.gif)
Test Coverage
![Test Coverage report](./docs/Coverage.png)

- [Back To Top](#)

### Known Bugs

- _Clicking the cancel button immediately sends you back, would be better to have a quick confirmation_
- _WebSocket implementation will not allow the JEST tests to pass_

#### Dependencies

- Axios
- @testing-library/react-hooks
- react-test-renderer
- classNames
- Testing Dependencies

  > StoryBook, Cypress

- [Back To Top](#)
