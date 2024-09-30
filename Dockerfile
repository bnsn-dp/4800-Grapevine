# Stage 1: Build frontend
FROM node:18 as build-stage
WORKDIR /code

# # Set working directory for frontend
# WORKDIR /app/frontend


# # Copy frontend package files
COPY ./grapevine /code/grapevine

WORKDIR /code/grapevine
# # Install frontend dependencies
RUN npm install

# # Copy frontend source code
# COPY ./Frontend/ecommerce_inventory ./

# # Build frontend (adjust this based on your React build process)
RUN npm run build

# Stage 2: Build Django backend
FROM python:3.10.8

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /code
COPY ./BACKEND/ /code/BACKEND/

RUN pip install -r ./BACKEND/requirements.txt
COPY --from=build-stage ./code/grapevine/build ./BACKEND/static/
COPY --from=build-stage ./code/grapevine/build/static ./BACKEND/static/
COPY --from=build-stage ./code/grapevine/build/index.html ./BACKEND/grapevine/templates/index.html

RUN python ./BACKEND/manage.py migrate
RUN python ./BACKEND/manage.py collectstatic --no-input

# Expose port 80 (adjust as necessary)
EXPOSE 80
WORKDIR /code/BACKEND/
# Command to run Django server
CMD ["gunicorn", "grapevine.wsgi:application", "--bind", "0.0.0.0:8000"]
