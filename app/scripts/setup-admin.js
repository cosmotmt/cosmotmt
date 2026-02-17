const { execSync } = require('child_process');
const crypto = require('node:crypto');

async function hashPassword(password, salt) {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    256
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("使用法: node setup-admin.js <email> <password>");
    process.exit(1);
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = await hashPassword(password, salt);

  const sql = `INSERT INTO admins (email, password, salt) VALUES ('${email}', '${hashedPassword}', '${salt}');`;
  
  try {
    console.log(`Registering admin: ${email}...`);
    execSync(`npx wrangler d1 execute DB --local --command "${sql}"`, { stdio: 'inherit' });
    console.log("\nSuccess! Admin registered.");
  } catch (err) {
    console.error("\nError: Failed to register admin.");
    process.exit(1);
  }
}

main();
