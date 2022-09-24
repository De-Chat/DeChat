export const encodeMessage = (command: string, payload: object) => {
  return `::${command}(${JSON.stringify(payload)})`;
};

export const decodeMessage = (msg: string) => {
  const regex = /::(\w+)\((.+)\)/;
  const found = msg.match(regex);
  if (found) {
    try {
      const command = found[1];
      const payload = JSON.parse(found[2]);
      return {
        command,
        payload,
      };
    } catch (e) {}
  }
  return null;
};
