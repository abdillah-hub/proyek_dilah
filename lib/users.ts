import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "users.json");

// Ensure the data directory and file exist
async function ensureFile() {
  const dir = path.join(process.cwd(), "data");
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]), "utf-8");
  }
}

export async function readUsersFile() {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
  }>;
}

export async function writeUsersFile(users: unknown[]) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
}
