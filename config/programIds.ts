export type SolanaEnvironment = "localnet" | "devnet" | "mainnet";

export type ProgramIdSet = {
  protocol: string;
  product: string;
  event: string;
};

export const PROGRAM_IDS: Record<SolanaEnvironment, ProgramIdSet> = {
  localnet: {
    protocol: "",
    product: "",
    event: "",
  },
  devnet: {
    protocol: "",
    product: "",
    event: "",
  },
  mainnet: {
    protocol: "",
    product: "",
    event: "",
  },
};

export const ACTIVE_ENVIRONMENT: SolanaEnvironment = "devnet";

export const ACTIVE_PROGRAM_IDS: ProgramIdSet = PROGRAM_IDS[ACTIVE_ENVIRONMENT];
