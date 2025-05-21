import { NextResponse } from 'next/server';

// This could be any database client, e.g., Prisma, Drizzle, Supabase client, etc.
// For this example, we're not connecting to a real database.
// import { db } from '@/lib/db'; // Example: your database client import

export async function POST(req: Request) {
  try {
    // 1. Get the conversation data from the request
    // We expect the frontend to send the full conversation history
    // and the conversationId when it decides to save it.
    const { conversationId, messages } = await req.json();

    // 2. Validate the data (important for real applications)
    if (!conversationId || !messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Missing conversationId or messages, or messages is not a non-empty array.' },
        { status: 400 }
      );
    }

    // 3. --- DATABASE LOGIC WOULD GO HERE ---
    // In a real application, you would now save this to your database.
    // For example, you might have a 'conversations' table where each row
    // has a 'conversationId' and a JSONB column for 'messages',
    // or a separate 'messages' table linked by 'conversationId'.

    console.log(`Received request to save conversation: ${conversationId}`);
    console.log('Messages to save:', JSON.stringify(messages, null, 2)); // Pretty print JSON

    // Example using a hypothetical 'db' client (e.g., Prisma):
    /*
    const savedConversation = await db.conversation.create({
      data: {
        id: conversationId, // Assuming your DB schema uses this as the primary key
        messages: messages, // Storing messages as JSON, or you might normalize this
        // You might also want to save other metadata like timestamps, userId, etc.
        // userId: user?.id // if you have user authentication
      },
    });
    console.log('Conversation saved to DB:', savedConversation);
    */

    // 4. Send a success response
    return NextResponse.json(
      { message: 'Conversation received for saving.', conversationId: conversationId, receivedMessagesCount: messages.length },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving conversation:', error);
    // Type guard for error
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to save conversation.', details: errorMessage }, { status: 500 });
  }
} 