# vue 3

## What it is
This is a simple frontend for the [MySQL Sample Database](https://www.mysqltutorial.org/mysql-sample-database.aspx).

It depends on my Webservice backend "spring2".
### Tooling
"vue3" is a SPA (Single page application), using vue.js.

This frontend uses:
* [Vue.js 2](https://vuejs.org/)
* [Vuetify](https://vuetifyjs.com/en/), a Vue component library 
* [Vuerouter](https://router.vuejs.org/)
* [node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* Javascript (as programming language)
  
## How to install
* "vue3" depends on its backend "spring2" and MySQL, so you should install and run them first.
* [Download and install node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Install vue 2](https://v2.vuejs.org/v2/guide/installation.html) with "npm install vue"
* You may find the [Vue CLI](https://cli.vuejs.org/) useful.
* Clone this repository ("vue3")
* Open a terminal
* Switch into the project directory
* Run "npm install"

## How to run
* Run the backend "spring2" first. This will use Port 8080.
* Run "vue3". This will use Port 8081, and expect the backend at Port 8080.
* For development: run "npm run serve"
* For production: run "npm run build"

## Todos
* Insert, Update, Delete is only implemented for Offices.
* Recursive Navigation in Employees doesn't refresh details correctly.
* Clean up code
* Fix browser console errors ("null" errors for data, caused by event timing)
## Pictures

![Office detail view](classic_models_offices.png)
