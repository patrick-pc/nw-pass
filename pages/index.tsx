import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useAccount, useSigner } from 'wagmi'
import toast from 'react-hot-toast'
import Image from 'next/image'
import QRCode from 'qrcode'
import Navbar from '../components/Navbar'

const CONTRACT_ADDRESS = '0x3cd266509d127d0eac42f4474f57d0526804b44e'

const Home: NextPage = () => {
  const [tokenId, setTokenId] = useState<Number>()
  const [fileURL, setFileURL] = useState()
  const [platform, setPlatform] = useState<String>()
  const [qrCode, setQRCode] = useState(null)

  const { address } = useAccount()
  const { data: signer } = useSigner()

  useEffect(() => {
    if (address) checkNfts()
  }, [address])

  const checkNfts = async () => {
    const baseURL = `https://polygon-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}/getNFTs/`
    const fetchURL = `${baseURL}?owner=${address}&contractAddresses%5B%5D=${CONTRACT_ADDRESS}`
    const { ownedNfts } = await fetch(fetchURL).then((nfts) => nfts.json())

    if (ownedNfts) {
      ownedNfts.map((nft: { title: string; id: { tokenId: string } }) => {
        if (nft.title.includes('Nights & Weekends S1')) {
          setTokenId(parseInt(nft.id.tokenId))
          console.log(parseInt(nft.id.tokenId))
        }
      })
    }
  }

  const createPass = async () => {
    const signatureToast = toast.loading('Waiting for signature...')

    const signatureMessage = `Sign this message to generate a test pass with ethpass.xyz\n${Date.now()}`
    const signature = await signer?.signMessage(signatureMessage)
    toast.dismiss(signatureToast)

    const payload = {
      contractAddress: CONTRACT_ADDRESS,
      tokenId: tokenId,
      image: '',
      chainId: 137,
      platform: 'apple',
      signature,
      signatureMessage,
      barcode: {
        message: 'Payload returned after successfully scanning a pass',
      },
    }
    // setPending(true)
    const pendingToast = toast.loading('Generating pass...')
    try {
      const response = await fetch('/api/ethpass/create', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          'content-type': 'application/json',
        }),
      })
      toast.dismiss(pendingToast)
      if (response.status === 200) {
        const json = await response.json()

        console.log('## POST Result', json)
        setFileURL(json.fileURL)
        setPlatform(payload.platform)

        QRCode.toDataURL(json.fileURL, {}, function (err, url) {
          if (err) throw err
          setQRCode(url)
        })
      } else if (response.status === 401) {
        toast.error(`Unable to verify ownership: ${response.statusText}`)
      } else {
        try {
          const { error, message } = await response.json()
          toast.error(error || message)
        } catch {
          toast.error(`${response.status}: ${response.statusText}`)
        }
      }
    } catch (err) {
      console.log('## POST ERROR', err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      // setPending(false)
      toast.dismiss(signatureToast)
    }
  }

  return (
    <div>
      <div className="relative overflow-x-hidden flex flex-col items-center h-screen w-full gap-8">
        <Navbar />
        <div className="gradient-bg"></div>
        <div className="hero">
          <h1 className="text-6xl font-medium">Buildspace Nights & Weekends S1 Pass</h1>
          <p className="text-xl opacity-50 mb-8">
            Get access to Founders, Inc. in San Francisco. Receive GTFOL notifications daily.
          </p>
          <button
            className="flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg text-lg gap-2 px-4 py-2 focus:outline-none hover:scale-105 transition duration-300 ease-in-out"
            onClick={createPass}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
            Generate Pass
          </button>
        </div>

        {fileURL && (
          <div className="mt-3 text-center sm:mt-5 flex flex-col justify-center align-center">
            <div className="mt-2 text-center">
              <p className="block text-sm font-medium text-gray-500 pointer-events-none">{`Scan QR code using your ${
                platform === 'google' ? 'Android' : 'Apple'
              } device`}</p>
              <div className="w-250 h-250 flex justify-center">
                <img src={qrCode} />
              </div>
              <p className="block text-sm font-medium text-gray-500 pointer-events-none mb-2">
                Or tap below to download directly on your mobile device.
              </p>
            </div>
            {platform && platform === 'apple' ? (
              <a href={fileURL} download>
                <Image src="/img/apple-wallet-add.png" width={120} height={37} />
              </a>
            ) : (
              platform && (
                <a target="_blank" href={fileURL} rel="noreferrer">
                  <Image src="/img/google-pay-add.png" width={180} height={48} />
                </a>
              )
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-8 p-8 pb-24">
          <div className="h-52 w-72 bg-[url('/img/nw1.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
          <div className="h-52 w-72 bg-[url('/img/nw2.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
          <div className="h-52 w-72 bg-[url('/img/nw3.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
          <div className="h-52 w-72 bg-[url('/img/nw4.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
        </div>
      </div>
    </div>
  )
}

export default Home
