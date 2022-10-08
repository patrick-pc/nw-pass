import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      const {
        chainId,
        contractAddress,
        image,
        platform,
        signature,
        signatureMessage,
        tokenId,
        barcode,
      } = req.body

      try {
        // Customize Pass
        let pass
        if (platform === 'apple') {
          pass = {
            labelColor: 'rgb(78,70,220)',
            backgroundColor: 'rgb(255,255,255)',
            foregroundColor: 'rgb(0,0,0)',
            description: 'Buildspace Nights & Weekends S1 Pass',
            auxiliaryFields: [],
            backFields: [],
            headerFields: [],
            primaryFields: [
              {
                key: 'primary1',
                label: 'Buildspace',
                value: 'N&W S1 Pass',
                textAlignment: 'PKTextAlignmentNatural',
              },
            ],
            secondaryFields: [
              {
                key: 'secondary1',
                label: 'CONTRACT ADDRESS',
                value: `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`,
                textAlignment: 'PKTextAlignmentLeft',
              },
              {
                key: 'secondary2',
                label: 'TOKEN ID',
                value: tokenId,
                textAlignment: 'PKTextAlignmentLeft',
              },
              {
                key: 'secondary3',
                label: 'NETWORK',
                value: 'Polygon',
                textAlignment: 'PKTextAlignmentLeft',
              },
            ],
          }
        } else {
          pass = {
            messages: [],
          }
        }

        // Request to create pass
        const payload = await fetch(
          `${process.env.API_HOST || 'https://api.ethpass.xyz'}/api/v0/passes`,
          {
            method: 'POST',
            body: JSON.stringify({
              chain: {
                name: 'evm',
                network: chainId,
              },
              nft: {
                contractAddress,
                tokenId,
              },
              image,
              pass,
              platform,
              signature,
              signatureMessage,
              barcode,
            }),
            headers: new Headers({
              'content-type': 'application/json',
              'x-api-key': process.env.ETHPASS_API_KEY as string,
            }),
          }
        )
        if (payload.status === 200) {
          const json = await payload.json()
          return res.status(200).json(json)
        } else {
          const json = await payload.json()
          return res.status(payload.status).send(json.message)
        }
      } catch (error) {
        return res.status(400).send(error.message)
      }

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}
