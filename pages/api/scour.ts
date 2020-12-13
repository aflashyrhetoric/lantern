// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Serverless functions: https://vercel.com/docs/serverless-functions/supported-languages

import { NowRequest, NowResponse } from "@vercel/node"

import got from "got"
import { schema, ProductPage, ProductPageStatus, Stocked } from "./shared"

const jsdom = require("jsdom")
const { JSDOM } = jsdom

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36"

const options = {
  headers: {
    "User-Agent": UA,
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

    if (!doc) {
      return
    }

    const { vendor } = productPage
    const {
      name,
      nameSelector,
      triggerSelector,
      priceSelector,
      expectedText,
    } = vendor

    const productName = doc.querySelector(nameSelector)
    let productNameText = ""
    if (productName) {
      productNameText = productName.textContent.trim()
    }
    const trigger = doc.querySelector(triggerSelector)
    let triggerText = ""
    if (trigger) {
      triggerText = trigger.textContent.trim()
    }
    const price = doc.querySelector(priceSelector)
    let priceText = ""
    if (price) {
      priceText = price.textContent.trim()
    }
    let soldOut = expectedText === triggerText.trim() && triggerText !== ""

    return {
      vendorName: name,
      name: productName,
      price: priceText,
      status: soldOut ? Stocked.SOLD_OUT : Stocked.IN_STOCK,
      triggerText,
      link: productPage.url,
    }
  } catch (e) {
    console.error(`***************************************ERROR: ${e}`)
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
