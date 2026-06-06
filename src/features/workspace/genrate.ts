export const generateInviteCode = (num: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  const randomValues = new Uint32Array(num);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < num; i++) {
    result += characters.charAt(randomValues[i] % charactersLength);
  }

  return result;
};