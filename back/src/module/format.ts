export const stringFormat = (message: string, args: string[]): string => {
  message = message.replace(
    /{[0-9]*}/g,
    (src, ...all) => args[Number(src.substring(1, src.length - 1))]
  );
  return message;
};
