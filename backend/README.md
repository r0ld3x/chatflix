# ChatFlix Backend

A **Chat app** which mainly focuses on **privacy** and **enjoyments** and also its written in **Next.js** and **Django**.

# Installation

#### Clone the Repositories

    git clone https://github.com/r0ld3x/chatflix.git

1.  Navigate to the backend directory:

    ```
    cd backend
    ```

2.  Create a virtual environment and activate it:

    ```

    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

    ```

3.  Install the dependencies:

    ```
    pip install -r requirements.txt
    ```

4.  Rename [.env.example](https://github.com/r0ld3x/chatflix-frontend/blob/master/.env.example) to `.env` in the root of the frontend directory and add the necessary environment variables.

5.  Apply the database migrations:

    ```
    python manage.py migrate
    ```

6.  Start the Django development server:

    ```
    python manage.py runserver
    ```

## Screenshots

![App Screenshot](https://github.com/r0ld3x/chatflix/assets/77254818/d6dbc62f-4b0e-40c6-89be-41717cf28f96)

## Authors

- [@r0ld3x](https://www.github.com/r0ld3x)

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
