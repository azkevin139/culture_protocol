export type SolanaEnvironment = "localnet" | "devnet" | "mainnet";

export type ProgramIdSet = {
  protocol: string;
  product: string;
  event: string;
};

export const PROGRAM_IDS: Record<SolanaEnvironment, ProgramIdSet> = {
  localnet: {
    protocol: "7i2N9qqqcfne1BouHhMw1vvNAo2aeVwwWhecWy5XrKqY",
    product: "2cTEcEM1B5pkVFrqSFnUDowgbRvqc5uoagRBAQ1Uehh7",
    event: "Q4JNMDYYGb1kktLz1yr6p5PktLvCyVCDcThzmjzji5i",
  },
  devnet: {
    protocol: "7i2N9qqqcfne1BouHhMw1vvNAo2aeVwwWhecWy5XrKqY",
    product: "2cTEcEM1B5pkVFrqSFnUDowgbRvqc5uoagRBAQ1Uehh7",
    event: "Q4JNMDYYGb1kktLz1yr6p5PktLvCyVCDcThzmjzji5i",
  },
  mainnet: {
    protocol: "",
    product: "",
    event: "",
  },
};

export const ACTIVE_ENVIRONMENT: SolanaEnvironment = "devnet";

export const ACTIVE_PROGRAM_IDS: ProgramIdSet = PROGRAM_IDS[ACTIVE_ENVIRONMENT];
