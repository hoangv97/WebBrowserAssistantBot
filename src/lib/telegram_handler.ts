import { sendPhoto, sendMessage } from '@/lib/telegram';
import { updateUser } from './user';
import { validatePassword } from './auth';
import { askChatbot } from './chatbot';

const handleText = async (senderId: number, user: any, text: string) => {
  if (text.startsWith('/password')) {
    const password = text.split(' ')[1];
    await updateUser(senderId, { password });
    if (validatePassword(password)) {
      await sendMessage(senderId, 'You are now authorized to use this bot.');
    } else {
      await sendMessage(senderId, 'Invalid password.');
    }
  } else if (text.startsWith('/start')) {
    await sendMessage(
      senderId,
      'Welcome to the Telegram bot! You can ask me anything.'
    );
    updateUser(senderId, { messages: [] });
  } else {
    await askChatbot(text, senderId, user);
  }
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
