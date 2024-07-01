# ChatFlix Frontend

A **Chat app** which mainly focuses on **privacy** and **enjoyments** and also its written in **Next.js** and **Django**.

## Running locally in development mode

#### Clone the Repositories

    git clone https://github.com/r0ld3x/chatflix.git

1.  Navigate to the frontend directory:

    ```
    cd frontend
    ```

2.  Install the dependencies:

    ```
    npm install
    ```

3.  Rename [.env.example](https://github.com/r0ld3x/chatflix-frontend/blob/master/.env.example) to `.env` in the root of the frontend directory and add the necessary environment variables.

4.  Start the development server:

    ```
    npm run dev
    ```

## Building and deploying in production

If you wanted to run this site in production, you should install modules then build the site with `npm run build` and run it with `npm start`:

    npm install
    npm run build
    npm start

You should run `npm run build` again any time you make changes to the site.

Note: If you are already running a webserver on port 80 (e.g. Macs usually have the Apache webserver running on port 80) you can still start the example in production mode by passing a different port as an Environment Variable when starting (e.g. `PORT=3000 npm start`).

## Configuring

If you configure a .env file (just copy [.env.example](https://github.com/r0ld3x/chatflix-frontend/blob/master/.env.example) over to '.env' and fill in the options) you can configure a range of options.

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Authors

- [@r0ld3x](https://www.github.com/r0ld3x)
