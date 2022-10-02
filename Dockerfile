FROM node:18 as build
WORKDIR /app
COPY la-soiree-ui /app
RUN npm ci
RUN npm run build

FROM python:3.10-alpine
RUN apk add build-base nginx
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/build /app/static
COPY main.py ./
COPY la_soiree la_soiree
COPY requirements.txt .
COPY db.db .
COPY application.yml .
RUN pip install -r requirements.txt
RUN pip install gunicorn

ENV PYTHONPATH /app

COPY deploy/docker/nginx.conf /etc/nginx/nginx.conf

RUN addgroup -S app
RUN adduser \
    --disabled-password \
    --ingroup app \
    app
RUN chmod -R o+rx /app
RUN chown -R app:app /var/lib/nginx
RUN chown -R app:app /var/log/nginx
RUN chown -R app:app /run/nginx
USER app:app

EXPOSE 5000
CMD ["/bin/sh", "-c", "nginx & gunicorn --bind=unix:/tmp/gunicorn.sock --workers=4 --threads=4 main:app"]
