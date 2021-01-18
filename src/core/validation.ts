export const emailValidation = (email: string): boolean => {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return re.test(email);
};

export const passwordValidation = (password: string): boolean => {
  const hasLetterAndNumber = /[a-zA-z]/.test(password) && /\d/.test(password);
  return hasLetterAndNumber && password.length >= 7;
};
