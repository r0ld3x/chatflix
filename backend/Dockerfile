# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster


# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=core.settings
ENV PIP_ROOT_USER_ACTION=ignore

# Set work directory
WORKDIR /app


# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run migrations
# RUN python manage.py migrate

# Create a non-root user
RUN adduser --disabled-password --gecos '' myuser
USER myuser

# Expose the port the app runs on
EXPOSE 8000


# VOLUME ["/opt/core/collected_static"]

# Use Gunicorn as the production server
CMD ["daphne", "-b", "0.0.0.0", "core.asgi:application"]
