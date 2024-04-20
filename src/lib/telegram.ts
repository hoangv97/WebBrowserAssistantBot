import axios from 'axios';

// telegram API wrapper
const API_PREFIX = 'https://api.telegram.org/bot';

export const sendMessage = async (
  senderId: number,
  message: string,
  parse_mode?: 'MarkdownV2' | 'HTML',
  reply_markup?: any[]
) => {
  const response = await axios.post(
    `${API_PREFIX}${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: senderId,
      text: message,
      parse_mode,
      reply_markup,
    }
  );
  return response;
};

export const sendPhoto = async (senderId: string, url: string) => {
  const response = await axios.post(
    `${API_PREFIX}${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
    {
      chat_id: senderId,
      photo: url,
    }
  );
  return response;
};
