import { checkAuth } from '@/lib/auth';
import { sendMessage } from '@/lib/telegram';
import { handleMessage } from '@/lib/telegram_handler';
import { createUser, getUser } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

// webhook event handler
export async function POST(req: NextRequest) {
  const body = await req.json();
  // console.log(JSON.stringify(body, null, 2));

  // send back a response// extract sender's ID
  const senderId = body.message.from.id;

  let user = await getUser(senderId);
  if (!user) {
    user = await createUser(senderId, body.message.from);
  }
  if (!user) {
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 200 }
    );
  }

  if (checkAuth(user, body.message)) {
    await handleMessage(senderId, user, body.message);
  } else {
    await sendMessage(
      senderId,
      'You are not authorized to use this bot. Enter /password <password> to authenticate.'
    );
  }

  return NextResponse.json({ message: 'Hello World' }, { status: 200 });
}
