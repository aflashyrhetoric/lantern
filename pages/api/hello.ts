// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import cheerio from 'cheerio'
import got from 'got'

const getResponseBody = async () => {
  const resp = await got(
    'https://www.bestbuy.com/site/msi-geforce-rtx-3070-ventus-3x-oc-bv-8gb-gddr6-pci-express-4-0-graphics-card-black/6438278.p?skuId=6438278',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
      },
      http2: true,
    },
  )

  // console.log(resp.body)
  console.log('Response retrieved and resolved successfully.')

  return resp.body
}

export default async (req, res) => {
  console.log(Date.now(), '\n\n\n\n\n\n\n\n\n\n')

  const body = await getResponseBody()
  const $ = cheerio.load(body)

  const value = $('.fulfillment-add-to-cart-button button').text()

  res.statusCode = 200
  res.json({ value: value })
}
