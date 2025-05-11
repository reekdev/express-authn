import { EnvironmentConfigService } from "./environment-config.service";

const environmentConfigServiceInstance = EnvironmentConfigService.getInstance();

export const ENV = environmentConfigServiceInstance.values;
