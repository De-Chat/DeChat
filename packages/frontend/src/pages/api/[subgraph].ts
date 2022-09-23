import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.thegraph.com/subgraphs/name/chee-chyuan/',
});

const handler = async (req: any, res: any) => {
  const { subgraph } = req.query;
  const graphRes = await client.post(subgraph, req.body);
  console.log(graphRes.data);
  return res.status(graphRes.status).json(graphRes.data);
};

export default handler;
