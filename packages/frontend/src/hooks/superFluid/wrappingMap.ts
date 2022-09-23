// map from token to super token
// https://docs.superfluid.finance/superfluid/developers/networks
const rawWrappingMap: Record<string, string> = {
  '0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7':
    '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f', // DAI -> DAIx
};

export const wrappingMap = Object.fromEntries(
  Object.entries(rawWrappingMap).map(([k, v]) => [k.toLowerCase(), v])
);

export const getSuperfluidSupertoken = (token: string) => wrappingMap[token];

export const getSuperfluidBaseTokens = () =>
  Object.keys(wrappingMap).map((t) => t.toLowerCase());
