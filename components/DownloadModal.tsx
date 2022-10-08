import { useEffect, useState } from 'react'
import { useDownloadModalContext } from '../contexts/downloadModal'
import Image from 'next/image'
import QRCode from 'qrcode'
import Modal from './Modal'

export enum Platform {
  APPLE = 'apple',
  GOOGLE = 'google',
}

export default function DownloadModal() {
  const { hideModal, open, content } = useDownloadModalContext()
  const [qrCode, setQRCode] = useState(null)
  const { fileURL, platform } = content

  useEffect(() => {
    if (!fileURL) return
    QRCode.toDataURL(fileURL, {}, function (error, url) {
      if (error) throw error
      setQRCode(url)
    })
  }, [fileURL])

  return (
    <Modal title="Pass Generated" isActive={open} onClose={hideModal}>
      <div className="flex flex-col text-center text-sm mt-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="opacity-50">{`Scan QR code using your ${
              platform === Platform.GOOGLE ? 'Android' : 'Apple'
            } device.`}</p>
            <div className="flex justify-center w-250 h-250">
              <img className="rounded-lg" src={qrCode} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="opacity-50">Or tap below to download directly on your mobile device.</p>

            <a
              className="flex items-center justify-center text-lg rounded-lg bg-zinc-750 border border-[#3B3C3F] hover:bg-zinc-650 transition w-full px-4 py-3 gap-2"
              href={fileURL}
              download
            >
              <img
                className="h-6"
                src={`/img/${
                  platform && platform === Platform.APPLE ? 'apple' : 'google'
                }-wallet.png`}
              />
              <p>Add to {platform && platform === Platform.APPLE ? 'Apple' : 'Google'} Wallet</p>
            </a>

            {/* {platform && platform === Platform.APPLE ? (
              <a href={fileURL} download>
                <Image src="/img/apple-wallet-add.png" width={120} height={37} />
              </a>
            ) : (
              platform && (
                <a href={fileURL} target="_blank" rel="noreferrer">
                  <Image src="/img/google-pay-add.png" width={180} height={48} />
                </a>
              )
            )} */}
          </div>
        </div>
      </div>
    </Modal>
  )
}
