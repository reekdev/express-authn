import { App } from "./app";
import { ENV } from "./environment";

async function bootstrap() {
  const appInstance = new App(ENV.PORT, ENV.NODE_ENV);

  try {
    await appInstance.initialize();
    appInstance.listen();
  } catch (error) {
    console.error(`Failed to bootstrap the application.`, error);
    process.exit(1);
  }

  const signals = [
    "SIGINT",
    "SIGTERM",
  ] as const satisfies Array<NodeJS.Signals>;
  for (let i = 0; i < signals.length; ++i) {
    const signal = signals[i]!;
    process.on(signal, async () => {
      console.log(`\nReceived ${signal}, closing application.`);
      await appInstance.close();
      process.exit(1);
    });
  }
}

bootstrap();
