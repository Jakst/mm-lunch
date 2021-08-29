import type { NextApiRequest, NextApiResponse } from 'next'
import { appInfo } from '../../../lib/app-info'

interface Data {
  url: string
  version: string
  notes?: string
  pub_date?: string
  signature?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = req.query as { versionInfo: [string, string] }
  if (!query.versionInfo) return res.status(404).end()

  const [os, version] = query.versionInfo

  if (os === 'darwin') {
    const url = `https://${req.headers.host}${appInfo.latest.binary}`
    const version = appInfo.latest.version

    res.status(200).json({ url, version })
  }

  return res.status(404).end()
}
