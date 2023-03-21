# Practice 4

This is the practice 4 built with TypeScript, HTML, SCSS and Tailwind. The project is configured to use Webpack as its build tool.

## Installation

To run the project locally, follow these steps:

1. Clone the repository on your computer: git clone

2. Install the project dependencies:

        cd Practice-4-Felipe
        npm install

3. Create a new firebase project and enable realtime database and storage

4. Create a file called "enviroment.ts" in the folder enviroments with this configuration:

        export const environment = {
          apiKey: yourFirebaseKeys
          authDomain: yourFirebaseKeys,
          projectId: yourFirebaseKeys,
          storageBucket: yourFirebaseKeys,
          messagingSenderId: 
          appId: yourFirebaseKeys
        };

3. Start the development server:

        npm run dev

4. You can try it yourself here: https://bootcamp-frontend-col-fs01.github.io/Practice-4-Felipe/
