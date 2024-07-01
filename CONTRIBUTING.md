# Contributing to ChatFlix

Thank you for considering contributing to ChatFlix! We appreciate your time and effort to help improve this project. Follow the steps below to set up the project locally and get started.

## Getting Started

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

4.  Rename [.env.example](https://github.com/r0ld3x/chatflix-frontend/blob/master/.env.example) to `.env` in the root of the frontend directory and add the necessary environment variables.

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

### Contributing Code

1.  Create a new branch for your feature or bugfix:

    ```
    git checkout -b your-feature-branch
    ```

2.  Make your changes and commit them:

    ```
    git commit -m "Description of your changes"
    ```

3.  Push your branch to GitHub:

    ```
    git push origin your-feature-branch
    ```

4.  Open a pull request on GitHub.

### Code Style and Guidelines

- Follow the existing code style and naming conventions.
- Write clear, concise commit messages.
- Ensure your code is well-documented and tested.

### Reporting Issues

If you encounter any issues, please report them using the [GitHub Issues](https://github.com/r0ld3x/chatflix-frontend/issues) page. Provide as much detail as possible, including steps to reproduce the issue.

## Thank You!

Thank you for contributing to ChatFlix! Your support is invaluable in making this project better.
