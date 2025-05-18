import express from "express";
import { PostgresConnector } from "./db/postgres-connector";
import { Environment } from "./environment/environments";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { notFoundHandler } from "./middleware/not-found-handler";
import { globalErrorHandler } from "./middleware/global-error-handler";

export class App {
  public expressApp: express.Application;
  public readonly port: number;
  public readonly env: Environment;

  constructor(port: number, environment: Environment) {
    this.expressApp = express();
    this.port = port;
    this.env = environment;
  }

  public async initialize(): Promise<void> {
    console.log("Initializing application.");
    this.setupMiddleware();
    await this.connectToDatabase();
    this.setupRoutes();
    this.setupErrorHandling();
    console.log("Application initialization complete.");
  }

  private setupMiddleware() {
    console.log("Setting up global middleware.");
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
    console.log("Global middleware setup complete.");
  }

  private setupRoutes(): void {
    console.log("Setting up routes.");
    this.expressApp.use("/api/v1/auth", new AuthRoutes().router);
  }

  private setupErrorHandling(): void {
    console.log("🛡️ Setting up error handlers...");
    this.expressApp.use(notFoundHandler); // Handles 404 for routes not matched
    this.expressApp.use(globalErrorHandler); // Global error handler, must be last
    console.log("Error handlers setup complete.");
  }

  private async connectToDatabase(): Promise<void> {
    console.log(`Attempting to connect to the database.`);
    const connectionSuccess = await PostgresConnector.connect();
    if (!connectionSuccess) {
      console.error("Database connection failed. Application will exit.");
      process.exit(1);
    }
    console.log("Database connection successful and pool initialized.");
  }

  public listen(): void {
    this.expressApp.listen(this.port, () => {
      console.log(`\nServer listening on port: ${this.port}`);
      console.log(`Environment: [${this.env}]`);
    });
  }

  public async close(): Promise<void> {
    console.log(" shutting down application...");
    await PostgresConnector.disconnect();
    console.log("Application shutdown complete.");
  }
}
