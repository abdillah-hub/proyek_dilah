import { NextRequest } from "next/server";
import { readUsersFile } from "@/lib/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email dan password wajib diisi!" },
        { status: 400 }
      );
    }

    const users = await readUsersFile();

    const user = users.find(
      (u: { email: string; password: string }) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return Response.json(
        { success: false, message: "Email atau password salah!" },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: `Selamat datang, ${user.name}!`,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "Terjadi kesalahan server!" },
      { status: 500 }
    );
  }
}



