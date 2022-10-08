import Head from 'next/head'
import { ConnectKitButton } from 'connectkit'

export default function Navbar() {
  return (
    <header className="relative w-full z-30">
      <Head>
        <title>Buildspace Nigts & Weekends S1 Pass</title>
        <meta name="description" content="Buildspace Nigts & Weekends S1 Pass" />
        <link rel="icon" href="/img/unicorn.png" />
      </Head>

      <div className="relative flex items-center justify-between lg:justify-around w-full px-4 py-8">
        <a
          className="text-xl font-medium hover:scale-105 transition duration-300 ease-in-out"
          href="https://buildspace.so/"
          target="_blank"
        >
          buildspace
        </a>
        <ConnectKitButton.Custom>
          {({ isConnected, show, truncatedAddress, ensName }) => {
            return (
              <button
                className="bg-zinc-850 rounded-lg text-sm px-4 py-2 focus:outline-none hover:scale-105 transition duration-300 ease-in-out"
                onClick={show}
              >
                {isConnected ? ensName ?? truncatedAddress : 'Connect Wallet'}
              </button>
            )
          }}
        </ConnectKitButton.Custom>
      </div>
    </header>
  )
}
