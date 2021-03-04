# Emotional Map Project



### Deployment

We have set up docker containers for this project.

Run a dev build (with hot reload):
```
docker-compose up
docker-compose down
```

Run a production build:
```
docker-compose -f docker-compose.prod.yml up -d
docker-compose logs -f
docker-compose -f docker-compose.prod.yml down
```

Docker deployment inspired by [mrcoles/node-react-docker-compose](https://github.com/mrcoles/node-react-docker-compose), with the addition of Caddy to serve the API over SSL.