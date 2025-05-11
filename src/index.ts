import express, { Request, Response } from "express";

const app = express();
const port = process.env?.["PORT"] || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Healthcheck endpoint
app.get("/health", (req: Request, res: Response) => {
  console.log(req);
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

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
