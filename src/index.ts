import express, { Request, Response } from "express";
import { dbPool } from "./db-pool";
import { signupHandler } from "./sign-up/sign-up.handler";
import { signinHandler } from "./sign-in/sign-in.handler";

const app = express();
const port = process.env?.["PORT"] || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Healthcheck endpoint
app.get("/health", async (req: Request, res: Response) => {
  // console.log(req);
  const client = await dbPool.connect();

  console.log({ client });

  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

app.post("/signup", signupHandler);
app.post("/signin", signinHandler);

// Root endpoint (optional)
app.get("/", (req: Request, res: Response) => {
  console.log(req);
  res.send("Hello from Express with TypeScript and ESModules!");
});

// Simple error handling middleware (optional, but good practice)
app.use((err: Error, req: Request, res: Response) => {
  console.log(req);
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
