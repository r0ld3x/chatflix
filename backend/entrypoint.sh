#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
# while ! pg_isready -h $POSTGRES_HOST -p 5432 -q -U $POSTGRES_USER; do
#   sleep 1
# done
echo "PostgreSQL started"

python manage.py migrate
exec daphne -b 0.0.0.0 core.asgi:application
