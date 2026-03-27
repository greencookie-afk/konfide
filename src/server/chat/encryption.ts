import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ENCRYPTED_CHAT_PREFIX = "enc:v1";
const CHAT_IV_LENGTH_BYTES = 12;

function deriveEncryptionKey(secret: string) {
  return createHash("sha256").update(secret).digest();
}

function getConfiguredSecrets() {
  const secrets = [process.env.CHAT_ENCRYPTION_KEY, process.env.AUTH_SECRET]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  if (!secrets.length) {
    throw new Error("CHAT_ENCRYPTION_KEY or AUTH_SECRET must be configured to protect chat messages.");
  }

  return [...new Set(secrets)];
}

function getPrimaryEncryptionKey() {
  return deriveEncryptionKey(getConfiguredSecrets()[0]);
}

function getDecryptionKeys() {
  return getConfiguredSecrets().map(deriveEncryptionKey);
}

export function isEncryptedChatBody(value: string) {
  return value.startsWith(`${ENCRYPTED_CHAT_PREFIX}:`);
}

export function encryptChatBody(plaintext: string) {
  const iv = randomBytes(CHAT_IV_LENGTH_BYTES);
  const cipher = createCipheriv("aes-256-gcm", getPrimaryEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    ENCRYPTED_CHAT_PREFIX,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(":");
}

export function decryptChatBody(ciphertext: string) {
  if (!isEncryptedChatBody(ciphertext)) {
    return ciphertext;
  }

  const [prefix, version, iv, authTag, payload] = ciphertext.split(":");

  if (!iv || !authTag || !payload || `${prefix}:${version}` !== ENCRYPTED_CHAT_PREFIX) {
    throw new Error("Encrypted chat payload is malformed.");
  }

  const ivBuffer = Buffer.from(iv, "base64url");
  const authTagBuffer = Buffer.from(authTag, "base64url");
  const payloadBuffer = Buffer.from(payload, "base64url");

  for (const key of getDecryptionKeys()) {
    try {
      const decipher = createDecipheriv("aes-256-gcm", key, ivBuffer);
      decipher.setAuthTag(authTagBuffer);

      return Buffer.concat([decipher.update(payloadBuffer), decipher.final()]).toString("utf8");
    } catch {
      // Try the next configured key so old messages remain readable after key upgrades.
    }
  }

  throw new Error("Unable to decrypt this chat message with the configured chat keys.");
}

export function decryptChatBodyForDisplay(ciphertext: string) {
  try {
    return decryptChatBody(ciphertext);
  } catch {
    return "[Encrypted message unavailable]";
  }
}
