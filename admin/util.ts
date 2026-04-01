import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { AnchorProvider, getProvider, Program } from "@coral-xyz/anchor";
import { getMint } from "@solana/spl-token";
import { Buffer } from "buffer";
import process from "process";
import {
  ACTIVE_PROGRAM_IDS,
  PROGRAM_IDS,
  SolanaEnvironment,
} from "../config/programIds";

function resolveCultureEnvironment(): SolanaEnvironment {
  const env = (process.env.CULTURE_ENV || "").toLowerCase();
  if (!env) return "devnet";

  if (env === "localnet" || env === "devnet" || env === "mainnet") {
    return env as SolanaEnvironment;
  }

  console.log(
    `Invalid CULTURE_ENV value: ${process.env.CULTURE_ENV}. Expected one of <localnet|devnet|mainnet>.`,
  );
  process.exit(1);
}

function resolveProtocolProgramId(): PublicKey {
  const explicitProgramAddress = process.env.PROGRAM_ADDRESS;
  if (explicitProgramAddress) {
    return new PublicKey(explicitProgramAddress);
  }

  const environment = resolveCultureEnvironment();
  const configuredProgramId = PROGRAM_IDS[environment]?.protocol;

  if (!configuredProgramId) {
    console.log(
      `No protocol program ID configured for CULTURE_ENV=${environment}. Update config/programIds.ts or set PROGRAM_ADDRESS.`,
    );
    process.exit(1);
  }

  return new PublicKey(configuredProgramId);
}

export async function getProtocolProgram() {
  const provider = getAnchorProvider();
  const programId = resolveProtocolProgramId();
  return Program.at(programId, provider);
}

export function getAnchorProvider(): AnchorProvider {
  return getProvider() as AnchorProvider;
}

export function getActiveProgramIds() {
  const environment = resolveCultureEnvironment();
  return PROGRAM_IDS[environment] || ACTIVE_PROGRAM_IDS;
}

export async function getMintInfo(mintPK: PublicKey) {
  return await getMint(getAnchorProvider().connection, mintPK);
}

export async function findMarketOutcomePoolPda(
  marketAccount: PublicKey,
  marketOutcome: string,
  price: number,
  forOutcome: boolean,
  protocolProgram: Program,
) {
  const [pda, _] = await PublicKey.findProgramAddress(
    [
      marketAccount.toBuffer(),
      Buffer.from(marketOutcome),
      Buffer.from(price.toFixed(3).toString()),
      Buffer.from(forOutcome.toString()),
    ],
    protocolProgram.programId,
  );
  return pda;
}

export async function findMarketOutcomePda(
  marketPda: PublicKey,
  marketOutcomeIndex: number,
  protocolProgram: Program,
) {
  const [pda, _] = await PublicKey.findProgramAddress(
    [marketPda.toBuffer(), Buffer.from(marketOutcomeIndex.toString())],
    protocolProgram.programId,
  );
  return pda;
}

export async function batchProcessInstructions(
  instructions: any[],
  batchSize = 5,
) {
  const provider = getAnchorProvider();

  let processedInstructions = 0;
  let instructionBatch = [] as TransactionInstruction[];
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    instructionBatch.push(instruction);

    if (instructionBatch.length == batchSize || i == instructions.length - 1) {
      const transaction = new Transaction();

      instructionBatch.forEach((instruction) => transaction.add(instruction));

      transaction.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      transaction.feePayer = provider.wallet.publicKey;

      try {
        const signedTx = await provider.wallet.signTransaction(transaction);
        const tx = await provider.connection.sendRawTransaction(
          signedTx.serialize(),
        );
        processedInstructions += instructionBatch.length;
        console.log(
          `Processed ${processedInstructions} / ${instructions.length} instructions - ${tx}`,
        );
      } catch (error) {
        console.error(
          `Exception while batch processing instructions ${JSON.stringify(
            instructionBatch,
          )}: `,
          error,
        );
      }
      instructionBatch = [];
    }
  }
}

export function checkResponse(response: {
  success: boolean;
  errors: object[];
}) {
  if (!response.success) {
    console.error(JSON.stringify(response.errors, null, 2));
  }
}
