import fs from "fs/promises";
import path from "path";
import os from "os";
import defaultUsersData from "@/data/users.json";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const isVercel = Boolean(process.env.VERCEL);

function getDataFilePath() {
  // Vercel serverless environment has a read-only filesystem except for /tmp
  if (isVercel) {
    return path.join(os.tmpdir(), "users.json");
  }
  return path.join(process.cwd(), "data", "users.json");
}

// In-memory cache fallback to ensure users are accessible even if disk IO fails
let inMemoryUsers: User[] = Array.isArray(defaultUsersData)
  ? (defaultUsersData as User[])
  : [];

async function ensureFile(filePath: string) {
  try {
    const dir = path.dirname(filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }

    try {
      await fs.access(filePath);
    } catch {
      // Initialize file with default users data
      await fs.writeFile(filePath, JSON.stringify(inMemoryUsers, null, 2), "utf-8");
    }
  } catch (error) {
    console.warn("ensureFile warning (will use memory fallback):", error);
  }
}

export async function readUsersFile(): Promise<User[]> {
  const filePath = getDataFilePath();
  try {
    await ensureFile(filePath);
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryUsers = parsed;
      return parsed;
    }
    return inMemoryUsers;
  } catch (error) {
    console.warn("readUsersFile failed, falling back to bundled users:", error);
    return inMemoryUsers;
  }
}

export async function writeUsersFile(users: User[]): Promise<void> {
  inMemoryUsers = users;
  const filePath = getDataFilePath();

  try {
    await ensureFile(filePath);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.warn("Primary write failed, attempting /tmp fallback:", error);
    try {
      const tmpPath = path.join(os.tmpdir(), "users.json");
      await fs.writeFile(tmpPath, JSON.stringify(users, null, 2), "utf-8");
    } catch (tmpError) {
      console.error("Failed to write to /tmp as well:", tmpError);
    }
  }
}

