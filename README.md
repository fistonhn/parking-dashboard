This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To set up the project, you must do the following:

- copy src/.env.js.template on src/ as .env.js

### With docker-compose
run `docker-compose up`  
open http://localhost:3012
### Classic way
- execute npm install
- start server with npm start

Our staging server:

https://dashboard.telesoftmobile.com/

Things to notice:

- We use style module approach, meaning that our style files are called {name}.module.style, to be able to imported inside a component without polluting the whole app
- We persist all index data (Table pages) with redux
- We use src/config/permissions to handle role base logic for the UI
- We use src/components/helpers/fields to generate the forms fields
