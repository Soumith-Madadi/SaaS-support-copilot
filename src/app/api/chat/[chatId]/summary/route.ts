import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getModel } from "@/lib/gemini"
import { SessionUser } from "@/types"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as SessionUser
    const { chatId } = await params

    // Get chat - user can only summarize their own chats, or company admin/team member can summarize company chats
    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        ...(user.role === "USER"
          ? { userId: user.id }
          : { companyId: user.companyId }),
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // If summary already exists, return it
    if (chat.summary) {
      return NextResponse.json({ summary: chat.summary })
    }

    // Generate summary using Gemini
    const conversationText = chat.messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n\n")

    const model = getModel('gemini-2.5-flash')
    const prompt = `You are a helpful assistant that creates concise summaries of conversations. Create a brief summary (2-3 sentences) of the following conversation:\n\n${conversationText}`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    })

    const response = await result.response
    const summary = response.text() || "No summary available."

    // Update chat with summary
    await db.chat.update({
      where: { id: chatId },
      data: { summary },
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Summary generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

