# Intiva Web Application

This web application is made with JavaScript, Vue 3, and PrimeVue for UI.
It also uses state management with Pinia and API calls with axios.

## Summary

This application is a web app for Intiva, which is a platform for managing expenses, savings, and incomes.
So, it includes the following features:

- Categorization: Classify financial data with different categories created by the user.
- Family group management: Manage family financial data (expenses, incomes, and savings).
- Reporting and analytics: Generate reports and visualizations to analyze spending patterns, savings progress, and overall financial health.
- User management: Manage user accounts, including registration, authentication, and authorization.

## Technologies Used

For the development of this application, the following technologies were used:

### Main Stack

- JavaScript: The programming language used for the development of the app.
- Vue 3: A PWA framework for creating single pag web applications (SPA). It is also component-based.
- Pinia: Library for managing state inside the app.
- Vue-router: Library for managing routing in the app.
- Vue-18n: Internationalization library for Vue.js.
- Axios: Library for making HTTP requests.
- PrimeVue: A UI library for Vue.js.

### Approaches and Patterns

- MVC (Model-View-Controller): The application is structured following the MVC pattern.
- Domain-Driven Design (DDD): The application is designed using DDD principles, focusing on the core domain and its logic.
- Layered Architecture: The application is organized into layers, such as the domain layer, infrastructure layer, application layer, and presentation layer, to separate concerns and improve maintainability.
- Assembler Pattern: Used for encapsulating data for making requests to the API.

## Documentation

The project includes basic documentation and is available in the `docs` folder. It includes:

- C4 Model Software Architecture Diagrams: includes context, container, and component level diagrams to provide an overview of the system architecture and its components.
- Class Diagrams: it includes class diagrams to illustrate the structure of the codebase and the relationships between classes.