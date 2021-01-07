// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Serverless functions: https://vercel.com/docs/serverless-functions/supported-languages

import { NowRequest, NowResponse } from "@vercel/node"

import got from "got"
import { MehData } from "../widgets/meh"

const jsdom = require("jsdom")
const { JSDOM } = jsdom

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36"

const options = {
  headers: {
    "User-Agent": UA,
    "accept-language": "en-US,en;q=0.9,ko;q=0.8",
  },
  http2: true,
}

const getResponseBody = async (url: string): Promise<MehData> => {
  try {
    const resp = await got(url, options)
    const body = resp.body
    const dom = new JSDOM(body)
    const doc = dom.window.document

    if (!doc) {
      return
    }

    const productName = doc.querySelector(".features h2")
    let productNameText = ""
    if (productName) {
      productNameText = productName.textContent.trim()
    }

    const priceButton = doc.querySelector(".buy-button")

    let priceText = ""
    let priceLink = ""

    if (priceButton) {
      priceText = priceButton.textContent.trim()
      priceText = priceText.substring(0, 25).trim()
      priceLink = priceButton.getAttribute("href")
    }

    const imageElement = doc.querySelector(".photos img")
    let src = ""
    if (imageElement) {
      src = imageElement.getAttribute("src")
    }

    return {
      name: productNameText,
      price: priceText,
      priceLink,
      image: src,
    }
  } catch (e) {
    console.error(`***************************************ERROR: ${e}`)
    return null
  }
}

export default async (req: NowRequest, res: NowResponse) => {
  const resp = await getResponseBody("https://meh.com")
  res.status(200).json(resp)
}
