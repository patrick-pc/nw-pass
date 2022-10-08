import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, chain } from 'wagmi'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { DownloadModalProvider } from '../contexts/downloadModal'
import { Toaster } from 'react-hot-toast'

const client = createClient(
  getDefaultClient({
    appName: 'gatepass',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [chain.mainnet, chain.polygon],
  })
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="midnight">
        <DownloadModalProvider>
          <Component {...pageProps} />
          <Toaster />
        </DownloadModalProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
