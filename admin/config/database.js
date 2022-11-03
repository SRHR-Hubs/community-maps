module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "0.0.0.0"),
      port: env.int("PGPORT", 5432),
      database: env("PGDATABASE", "data"),
      user: env("PGUSER", "root"),
      password: env("PGPASSWORD", "root"),
      ssl: env.bool("DATABASE_SSL", false),
    },
    debug: env.bool("DEBUG", false),
  },
});
