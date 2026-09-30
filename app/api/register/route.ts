import { NextRequest } from "next/server";
import { readUsersFile, writeUsersFile } from "@/lib/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "Semua field wajib diisi!" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: "Password minimal 6 karakter!" },
        { status: 400 }
      );
    }

    const users = await readUsersFile();

    const existingUser = users.find(
      (u: { email: string }) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return Response.json(
        { success: false, message: "Email sudah terdaftar!" },
        { status: 409 }
      );
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password, // In production, hash this with bcrypt
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsersFile(users);

    return Response.json(
      {
        success: true,
        message: "Registrasi berhasil! Mengalihkan ke dashboard...",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { success: false, message: "Terjadi kesalahan server!" },
      { status: 500 }
    );
  }
}

