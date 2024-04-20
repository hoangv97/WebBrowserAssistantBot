const { BOT_PASSWORD } = process.env;

export const checkAuth = (user: any, message: any) => {
  if (!BOT_PASSWORD) {
    return true;
  }
  if (message.text?.startsWith('/password')) {
    return true;
  }
  return user.data?.password === BOT_PASSWORD;
};

export const validatePassword = (password: string) => {
  return password === BOT_PASSWORD;
};
