export const parseJWT = (jwt: string) => {
  return JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
};
