export const emailValidation = (email: string): boolean => {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return re.test(email);
};

export const passwordValidation = (password: string): boolean => {
  if (password.length < 7) {
    return false;
  }
  if (/[a-zA-z]/.test(password) && /\d/.test(password)) {
    return true;
  }
  return false;
};
