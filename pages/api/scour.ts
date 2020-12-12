// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Serverless functions: https://vercel.com/docs/serverless-functions/supported-languages

import { NowRequest, NowResponse } from "@vercel/node"

import got from "got"
import { schema, ProductPage, ProductPageStatus, Stocked } from "./shared"

const jsdom = require("jsdom")
const { JSDOM } = jsdom

const options = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
  },
  http2: true,
}

const getResponseBody = async (
  productPage: ProductPage,
): Promise<ProductPageStatus> => {
  try {
    const resp = await got(productPage.url, options)
    const body = resp.body
    const dom = new JSDOM(body)
    const doc = dom.window.document

    const { vendor } = productPage
    const {
      name,
      nameSelector,
      triggerSelector,
      priceSelector,
      expectedText,
    } = vendor

    if (!doc) {
      return {
        vendorName: name,
        name: "-",
        price: 0,
        status: Stocked.SOLD_OUT,
        triggerText: "-",
        link: productPage.url,
      }
    }

    const productName = doc.querySelector(nameSelector).textContent.trim()
    const triggerText = doc.querySelector(triggerSelector).textContent
    const price = doc.querySelector(priceSelector).textContent
    let soldOut = expectedText === triggerText.trim() && triggerText !== ""

    return {
      vendorName: name,
      name: productName,
      price,
      status: soldOut ? Stocked.SOLD_OUT : Stocked.IN_STOCK,
      triggerText,
      link: productPage.url,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

export default async (req: NowRequest, res: NowResponse) => {
  const statuses = await Promise.all(
    schema.map(async (page) => {
      const resp = await getResponseBody(page)
      return resp
    }),
  )
  res.status(200).json(statuses)
}