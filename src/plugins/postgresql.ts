import fp from "fastify-plugin";
import pgPromise from "pg-promise";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://dennis:password@localhost:5432/marketplace";

const pgp = pgPromise({});
export const db = pgp(DATABASE_URL);

export default fp(async (fastify) => {
  fastify.decorate("db", db);

  fastify.addHook("onClose", () => {
    pgp.end();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    db: pgPromise.IDatabase<unknown>;
  }
}
