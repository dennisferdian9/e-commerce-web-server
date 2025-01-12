import { buildApp } from "./app";

const startServer = async () => {
  const app = await buildApp();
  try {
    const port = 8080;
    await app.listen({ port: port });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
