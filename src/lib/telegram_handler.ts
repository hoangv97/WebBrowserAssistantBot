import { sendPhoto, sendMessage } from '@/lib/telegram';
import { updateUser } from './user';
import { validatePassword } from './auth';

const handleText = async (senderId: number, user: any, text: string) => {
  if (text.startsWith('/password')) {
    const password = text.split(' ')[1];
    await updateUser(senderId, { password });
    if (validatePassword(password)) {
      await sendMessage(senderId, 'You are now authorized to use this bot.');
    } else {
      await sendMessage(senderId, 'Invalid password.');
    }
    return;
  }

  await sendMessage(senderId, `You said: ${text}`);
};

export const handleMessage = async (
  senderId: number,
  user: any,
  message: any
) => {
  console.log(user, message);

  if (message.text) {
    await handleText(senderId, user, message.text);
  }
};
