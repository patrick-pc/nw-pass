import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, chain } from 'wagmi'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'

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
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
