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
  const args = process.argv.slice(2);
  const isRemote = args.includes('--remote');
  const filteredArgs = args.filter(arg => arg !== '--remote');

  const email = filteredArgs[0];
  const password = filteredArgs[1];

  if (!email || !password) {
    console.error("使用法: node setup-admin.js <email> <password> [--remote]");
    process.exit(1);
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = await hashPassword(password, salt);

  const sql = `INSERT INTO admins (email, password, salt) VALUES ('${email}', '${hashedPassword}', '${salt}');`;
  const target = isRemote ? '--remote' : '--local';
  
  try {
    console.log(`Registering admin (${isRemote ? 'REMOTE' : 'LOCAL'}): ${email}...`);
    // データベース名は wrangler.toml に合わせて 'db' (小文字) に修正
    execSync(`npx wrangler d1 execute db ${target} --command "${sql}"`, { stdio: 'inherit' });
    console.log("\nSuccess! Admin registered.");
  } catch (err) {
    console.error("\nError: Failed to register admin.");
    process.exit(1);
  }
}

main();
