const { execSync } = require('child_process');
const crypto = require('node:crypto');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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

  console.log(`--- Admin Registration (${isRemote ? 'REMOTE' : 'LOCAL'}) ---`);
  
  const email = await question("Email: ");
  const password = await question("Password: ");
  rl.close();

  if (!email || !password) {
    console.error("Error: Email and password are required.");
    process.exit(1);
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = await hashPassword(password, salt);

  // SQLインジェクションのリスクはあるが、ローカルのセットアップスクリプトなので簡潔さを優先する。
  const sql = `INSERT INTO admins (email, password, salt) VALUES ('${email}', '${hashedPassword}', '${salt}');`;
  const target = isRemote ? '--remote' : '--local';
  
  try {
    console.log(`\nRegistering admin: ${email}...`);
    execSync(`npx wrangler d1 execute db ${target} --command "${sql}"`, { stdio: 'inherit' });
    console.log("\nSuccess! Admin registered.");
  } catch (err) {
    console.error("\nError: Failed to register admin.");
    process.exit(1);
  }
}

main();
