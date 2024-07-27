import type { AppProps } from 'next/app'

import Layout from '@/components/layout'
import Modal from '@/components/Modal'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Modal isOpen title="Test Modal"/>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
