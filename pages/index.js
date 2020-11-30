import Head from 'next/head'
import { useState } from 'react'

import { generateQRCode } from '../utils/qrcode'

export default function Home({ url: initialUrl, svg: initialSvg }) {
  const [url, setUrl] = useState(initialUrl);
  const [svg, setSvg] = useState(initialSvg);
  const [encodedUrl, setEncodedUrl] = useState(initialUrl);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await fetch(`/api/generate?url=${encodeURIComponent(url)}`);
    const data = await resp.json();
    if (data.success) {
      setSvg(data.svg);
      setEncodedUrl(data.url);

      if (process.browser) {
        history.pushState({ url }, '', `?url=${encodeURIComponent(url)}`);
      }
    }
  }

  return (
    <div className="bg-lime-50 min-h-screen flex items-center justify-around">
      <Head>
        <title>QR Code SVG Generator</title>
      </Head>

      <main className="w-full h-screen sm:h-auto sm:max-w-lg p-4 sm:p-6 lg:p-8 xl:p-10 bg-white sm:rounded-xl sm:shadow-lg text-center">
        <h1 className="text-2xl sm:text-4xl text-lime-600 font-semibold">
          QR Code SVG Generator
        </h1>

        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="my-2">
            <input type="url" name="url" value={url} onChange={e => setUrl(e.target.value)} required id="url" className="shadow-sm focus:ring-lime-500 focus:border-lime-500 block w-full sm:text-sm lg:text-xl text-gray-700 border-gray-300 rounded-md" placeholder="https://www.yourwebsite.com/" />
          </div>
          <button type="submit" className="block w-full items-center px-6 py-3 border border-transparent text-base sm:text-lg font-medium rounded-md shadow text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">
            Generate QR Code
          </button>
        </form>

        {svg && (
          <div className="flex flex-col items-center justify-around mt-8" suppressHydrationWarning={true}>
            {process.browser ? (
              <a
                href={URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))}
                download={`qrcode-${url.replace(/https?\:\/\//, '').replace(/\/$/, '')}.svg`}
              >
                <div dangerouslySetInnerHTML={{ __html: svg }} />
              </a>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            )}
          </div>
        )}

        {encodedUrl && <div className="text-gray-400 text-xs truncate">{encodedUrl}</div>}
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  let svg = null;
  if ('url' in context.query && context.query.url.length) {
    svg = generateQRCode(context.query.url);
  }
  return {
    props: {
      url: context.query.url || '',
      svg,
    },
  }
}
