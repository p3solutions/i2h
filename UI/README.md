# I2h

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# PORTS used
1. mongodb use 27017
2. server-side node-app use 
  'http://localhost:3000' or
  'http://54.191.86.94:81'
3. angular web-app use 4200


# The Webapp is available publicly on 
http://ec2-54-191-86-94.us-west-2.compute.amazonaws.com

## commands after deployment
1. for restarting front end server
`sudo service nginx restart`

2. for restarting DB service
`sudo service mongod restart`

Simiilar commands
`sudo service mongod status`
`sudo service mongod stop`
`sudo service mongod start`



## NOTES
1. Password attempt limitation not yet implemented.
2. Should we redirect to sign-in after successful password change
3. Reloading profile/other pages doesn't make sidebar link active
4. Address pg, click edit button on last address, must scroll to maintain that in view, it scrolls down & hide because above height increased 