# AcmeProductNgrx

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.19.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



Features that this project is going to implement... 

- Should implement routing to Home page and Product List

- home page:
    Which just has Welcome page

- Product List page: 

    - Side list of all products
    - Has a button to display product code, and can toggle on and off
    - Has ability to add item, which can save, delete, and cacel
    - if you click on existing item, it will show item and all of details, and yes there is an ability to edit details of item... 


- one feature as well that will be needed to be added is fake timers or promises to emulate a database call.
- implementing type of R<T> in typescript
- Also implementing unit tests
- Implementing linter 
- make sure to create method that creates unique guid for id. 

Angular redux pattern aka => NgRx 

Rdux principles: 

- Single source of truth, the store, so making the reducer a single source of truth
- State is read only and only changed by dispatching actions 
- changes are made using pure functions called reducers

Notes on Implementing Redux pattern via Angular:

For setting up the store: 
    - Import StoreModule and add to Imports, use .forRoot and give the Root reducer
    - Note: will need to create a root reducer with StoreState type... 
    - Will need to define multiple reducers, like in Redux -> so use the combineReducer -> Feature Module State Composition

A quick note on defining global state for redux application: 
    - define state for every slice that is in use, export that interface 
    - then define a global state and use all of the exported
         interface slices of state to compose the global state
    