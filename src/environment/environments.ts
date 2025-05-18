export const environments = ["development", "production"] as const;

export type Environment = (typeof environments)[number];
