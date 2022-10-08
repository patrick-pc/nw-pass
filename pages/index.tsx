import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { useDownloadModalContext } from '../contexts/downloadModal'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import Navbar from '../components/Navbar'
import GeneratePassButton from '../components/GeneratePassButton'
import toast from 'react-hot-toast'

const CONTRACT_ADDRESS = '0x3cd266509d127d0eac42f4474f57d0526804b44e'

const Home: NextPage = () => {
  const [tokenId, setTokenId] = useState(-1)
  const [disabled, setDisabled] = useState(false)
  const { showModal: showDownloadModal, open } = useDownloadModalContext()

  const { address } = useAccount({
    onDisconnect() {
      setTokenId(-1)
    },
  })
  const { data: signer } = useSigner()

  useEffect(() => {
    if (address) checkNfts()
  }, [address])

  const checkNfts = async () => {
    const baseURL = `https://polygon-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}/getNFTs/`
    const fetchURL = `${baseURL}?owner=${address}&contractAddresses%5B%5D=${CONTRACT_ADDRESS}`
    const { ownedNfts } = await fetch(fetchURL).then((nfts) => nfts.json())

    if (ownedNfts.length > 0) {
      ownedNfts.map((nft: { title: string; id: { tokenId: string } }) => {
        if (nft.title.includes('Nights & Weekends S1')) setTokenId(parseInt(nft.id.tokenId))
      })
    } else {
      setTokenId(-2)
    }
  }

  const generatePass = async (platform: string) => {
    // Check address
    if (!address) {
      toast('Connect wallet to continue.', {
        icon: '🦊',
      })
      return
    }

    // Get signature
    const signatureToast = toast.loading('Waiting for signature...')
    let signature = ''
    let signatureMessage = ''
    try {
      signatureMessage = `Sign this message to generate a Buildspace Nights & Weekends S1 Pass. \n${Date.now()}`
      signature = await signer?.signMessage(signatureMessage)
    } catch (error) {
      console.log(error.code)
      return
    } finally {
      toast.dismiss(signatureToast)
    }

    // Send request
    const payload = {
      contractAddress: CONTRACT_ADDRESS,
      tokenId: tokenId,
      image: 'https://nwpass.vercel.app/img/moon.png',
      chainId: 137,
      platform: platform,
      signature,
      signatureMessage,
      barcode: {
        message: 'Verified buildspace nights & weekends s1 pass holder.',
      },
    }

    setDisabled(true)
    const pendingToast = toast.loading('Generating pass...')
    try {
      const response = await fetch('/api/ethpass/create', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          'content-type': 'application/json',
        }),
      })

      if (response.status === 200) {
        const json = await response.json()

        console.log('## POST Result', json)
        showDownloadModal({
          fileURL: json.fileURL,
          platform: payload.platform,
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
    } catch (error) {
      console.log('## POST Error', error)
      toast.error(error.message)
    } finally {
      setDisabled(false)
      toast.dismiss(pendingToast)
    }
  }

  const renderButton = () => {
    if (tokenId === -2) {
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="italic opacity-75">
            Oops! Looks like you don't hold a Buildspace Nights & Weekends S1 NFT.
          </p>

          <div>
            <a
              className="flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg text-lg gap-2 px-4 py-2 focus:outline-none hover:scale-105 transition duration-300 ease-in-out"
              href="https://buildspace.so/nights-weekends"
              target="_blank"
            >
              Apply for S2
              <ArrowRightIcon className="h-4 w-4 stroke-white" />
            </a>
          </div>
        </div>
      )
    } else {
      return <GeneratePassButton generatePass={generatePass} disabled={disabled} />
    }
  }

  return (
    <div className="relative overflow-x-hidden flex flex-col items-center h-screen w-full gap-8">
      <Navbar />
      <div className="gradient-bg"></div>
      <div className="hero">
        <h1 className="text-6xl font-medium leading-tight">Buildspace Nights & Weekends S1 Pass</h1>
        <p className="text-xl opacity-50 mb-8">
          Get access to Founders, Inc. in San Francisco. Receive GTFOL notifications daily.
        </p>
        {renderButton()}
      </div>

      <div className="flex flex-wrap justify-center gap-8 p-8 pb-24">
        <div className="h-52 w-72 bg-[url('/img/nw1.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
        <div className="h-52 w-72 bg-[url('/img/nw2.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
        <div className="h-52 w-72 bg-[url('/img/nw3.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
        <div className="h-52 w-72 bg-[url('/img/nw4.jpeg')] bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"></div>
      </div>
    </div>
  )
}

export default Home
