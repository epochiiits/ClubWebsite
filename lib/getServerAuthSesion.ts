import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"

export async function getServerAuthSession(request: NextRequest) {
  // Cast needed due to mismatch between App Router request and expected type
  return await getServerSession({ req: request, options: authOptions } as any)
}
