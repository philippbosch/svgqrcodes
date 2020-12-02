import Head from 'next/head'
import { useState } from 'react'

import { generateQRCode } from '../utils/qrcode'

const defaultColor = '#000000';

export default function Home({ url: initialUrl, svg: initialSvg, color: initialColor }) {
  const [url, setUrl] = useState(initialUrl);
  const [svg, setSvg] = useState(initialSvg);
  const [encodedUrl, setEncodedUrl] = useState(initialUrl);
  const [color, setColor] = useState(initialColor);

  const buildQueryString = (url, color) => `?url=${encodeURIComponent(url)}${color !== defaultColor ? `&color=${encodeURIComponent(color)}` : ''}`

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await fetch(`/api/generate${buildQueryString(url, color)}`);
    const data = await resp.json();
    if (data.success) {
      setSvg(data.svg);
      setEncodedUrl(data.url);

      if (process.browser) {
        history.pushState({ url }, '', buildQueryString(url, color));
      }
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen flex items-center justify-around">
      <Head>
        <title>SVG QR Codes</title>
        <meta name="description" content="No-frills SVG QR code generator" />
        <script async defer data-domain="svgqr.codes" src="https://plausible.io/js/plausible.js"></script>
      </Head>

      <main className="w-full h-screen sm:h-auto sm:max-w-lg p-4 sm:p-6 lg:p-8 xl:p-10 bg-white sm:rounded-xl sm:shadow-lg text-center">
        <h1 className="text-2xl sm:text-4xl text-lime-600 font-semibold tracking-tight">
          <a href="/">SVG QR Codes</a>
        </h1>

        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="my-2">
            <label htmlFor="url" className="sr-only">URL</label>
            <input
              type="url"
              name="url"
              id="url"
              value={url}
              onFocus={e => { if (url === '') { setUrl('https://'); }}}
              onChange={e => { setUrl(e.target.value); }}
              required
              id="url"
              className="
                shadow-sm
                focus:ring-lime-500
                focus:border-lime-500
                block
                w-full
                sm:text-sm
                lg:text-xl
                text-gray-700
                border-gray-300
                rounded-md
                placeholder-gray-300
              "
              placeholder="https://www.yourwebsite.com/"
              tabIndex={0}
            />
          </div>
          <details className="
            text-left
            mb-4
            text-gray-500
          ">
            <summary className="
              text-xs
              cursor-pointer
              px-1
              rounded-sm
              focus:outline-none
              focus:ring-2
              focus:ring-lime-500
              focus:border-lime-500
            ">
              Advanced options
            </summary>
            <label className="flex space-x-2 items-center text-gray-700 mt-2">
              <span className="font-semibold">Color</span>
              <input type="color" name="color" value={color} onChange={e => { setColor(e.target.value); }} />
            </label>
            </details>
          <button
            type="submit"
            className="
              block
              w-full
              items-center
              px-6
              py-3
              border
              border-transparent
              text-base
              sm:text-lg
              font-medium
              rounded-md
              shadow
              text-white
              bg-lime-700
              hover:bg-lime-700
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-lime-500
            "
            tabIndex={0}
          >
            Generate QR Code
          </button>
        </form>

        {svg && (
          <div className="flex flex-col items-center justify-around mt-8" suppressHydrationWarning={true}>
            {process.browser ? (
              <a
                href={URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))}
                download={`qrcode-${url.replace(/https?\:\/\//, '').replace(/\/$/, '')}.svg`}
                className="transition transform hover:scale-105 focus:scale-110 focus:outline-none"
                title="Click to download SVG file"
              >
                <div dangerouslySetInnerHTML={{ __html: svg }} />
              </a>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            )}
          </div>
        )}

        {encodedUrl && <div className="text-gray-400 text-xs truncate mb-4">{encodedUrl}</div>}
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
      color: context.query.color || defaultColor,
      svg,
    },
  }
}
