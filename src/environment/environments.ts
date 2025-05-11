export const environments = ["development", "production"] as const;

export type Environments = (typeof environments)[number];
