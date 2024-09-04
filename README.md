# ChatFlix

A **Chat app** which mainly focuses on **privacy** and **enjoyments** and also its written in **Next.js** and **Django**.

### Prerequisites

- Node.js and npm (for the frontend)
- Python and pip (for the backend)
- Django
- Git

### Clone the Repositories

     git clone https://github.com/r0ld3x/chatflix.git

### Setting Up the Frontend

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

### Setting Up the Backend

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

4.  Fill core/settings.py especially resend api.

5.  Apply the database migrations:

    ```
    python manage.py migrate
    ```

6.  Start the Django development server:

    ```
    python manage.py runserver
    ```

### Running the Application

Once both the frontend and backend servers are running, you should be able to access the application at [http://localhost:3000](http://localhost:3000).

## Screenshots

![Screen Shot](https://github.com/user-attachments/assets/1e9ef121-ccb6-4f2b-9742-3f3276851396)

## Authors

- [@r0ld3x](https://www.github.com/r0ld3x)

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
