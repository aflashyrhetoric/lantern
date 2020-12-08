// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Serverless functions: https://vercel.com/docs/serverless-functions/supported-languages

import { NowRequest, NowResponse } from "@vercel/node"

import cheerio from "cheerio"
import got from "got"
import { schema, ProductPage, ProductPageStatus, Stocked } from "./shared"

const options = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
  },
}

const getResponseBody = async (
  productPage: ProductPage,
  res: NowResponse,
): Promise<ProductPageStatus> => {
  let resp

  try {
    resp = await got(productPage.url, options)
  } catch (err) {
    res.status(502)
    res.end(err)
    return
  }

  const body = resp.body
  const $ = cheerio.load(body)

  const { vendor } = productPage
  const {
    name,
    nameSelector,
    buttonSelector,
    priceSelector,
    expectedText,
  } = vendor

  const productName = $(nameSelector).text().trim()
  const buttonText = $(buttonSelector).text()
  const price = $(priceSelector).text()
  const soldOut = expectedText === buttonText && buttonText !== ""

  return {
    vendorName: name,
    name: productName,
    price,
    status: soldOut ? Stocked.SOLD_OUT : Stocked.IN_STOCK,
    link: productPage.url,
  }
}

export default async (req: NowRequest, res: NowResponse) => {
  const statuses = await Promise.all(
    schema.map(async (page) => {
      const resp = await getResponseBody(page, res)
      return resp
    }),
  )
  res.status(200).json(statuses)
}
