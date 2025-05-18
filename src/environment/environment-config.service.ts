import {
  ApplicationEnvironmentVariable,
  environmentSchema,
} from "./environment.schema";
import { Environment } from "./environments";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { config } from "dotenv";

export class EnvironmentConfigService {
  private static instance: EnvironmentConfigService;
  public readonly values: ApplicationEnvironmentVariable;
  private static readonly DEFAULT_ENVIRONMENT: Environment = "development";

  private constructor() {
    // console.log("inside EnvironmentConfigService:constructor");

    // console.log("\n\nbefore load");
    // console.log("does exist:", process.env?.["RANDOM_DUMMY_DFDFDF_LKLK"]);

    this.values = this.loadAndValidate();

    // console.log("\n\nafter load");
    // console.log("does exist:", process.env?.["RANDOM_DUMMY_DFDFDF_LKLK"]);

    // console.log(process.env?.["PORT"]);

    // console.log(process.env?.["PORT"]);
  }

  private loadAndValidate(): ApplicationEnvironmentVariable {
    this.loadDotEnvFiles();
    const validatedEnvironmentVariables = this.validateEnvironmentVariables();
    return validatedEnvironmentVariables;
  }

  private loadDotEnvFiles(): void {
    // console.log("inside loadDotEnvFiles");
    const currentEnvironment =
      process.env?.["NODE_ENV"] ?? EnvironmentConfigService.DEFAULT_ENVIRONMENT;

    // console.log({ currentEnvironment });

    const baseEnvironmentFileNames = [
      `.env.${currentEnvironment}.local`,
      `.env.${currentEnvironment}`,
      `.env.local`,
      `.env`,
    ] as const;

    let loadedAtleastOneFile = false;

    for (let i = 0; i < baseEnvironmentFileNames.length; ++i) {
      const fileName = baseEnvironmentFileNames[i]!;
      // console.log({ fileName });
      const projectRootDirectory = process.cwd();

      // console.log("projectRootDirectory: ", process.cwd());
      const environmentFilePath = resolve(projectRootDirectory, fileName);

      // console.log({ environmentFilePath });

      if (existsSync(environmentFilePath)) {
        loadedAtleastOneFile = true;
        // console.log(`${environmentFilePath} exists.`);
        config({ path: environmentFilePath, override: true });
      } else {
        // console.log(`${environmentFilePath} does not exist.`);
      }
    }

    if (!loadedAtleastOneFile) {
      console.warn(
        `\n\n\nNo specific .env files found for environment '${currentEnvironment}' in project root.
        \nRelying on system environment variables or a general .env file if present.\n`
      );
    }
  }

  private validateEnvironmentVariables(): ApplicationEnvironmentVariable {
    try {
      return environmentSchema.parse(process.env);
    } catch (error: unknown) {
      console.error("FATAL: Environment variable validation failed");
      console.error(
        "Application cannot start due to invalid configuration. Exiting."
      );

      // console.log(error);

      process.exit(1);
    }
  }

  public static getInstance(): EnvironmentConfigService {
    if (!EnvironmentConfigService.instance) {
      EnvironmentConfigService.instance = new EnvironmentConfigService();
    }
    return EnvironmentConfigService.instance;
  }
}
