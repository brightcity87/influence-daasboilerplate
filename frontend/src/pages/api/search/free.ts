import { NextApiResponse } from "next";

import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchTerm } = req.query;
  const path = '/api/database/limited';
  const api = process.env.NEXT_PUBLIC_BACKEND_URL + path;

  if (!api) return;

  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ searchTerm }),
  });
  const results = await response.json();
  res.status(200).json(results);
}
