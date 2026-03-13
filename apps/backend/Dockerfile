FROM pgvector/pgvector:pg18
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB zuugle_suchseite_dev
EXPOSE 5433
COPY database.sql /docker-entrypoint-initdb.d/
