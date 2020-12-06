// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import cheerio from "cheerio"
import got from "got"
import { schema, options, ProductPage, Vendor } from "../../shared"

enum Stocked {
  SOLD_OUT = "SOLD OUT",
  IN_STOCK = "IN STOCK NOW",
}

interface ProductPageStatus {
  vendor: Vendor
  status: Stocked
  buttonText: string
}

const getResponseBody = async (
  page: ProductPage,
): Promise<ProductPageStatus> => {
  const resp = await got(page.url, options)
  console.log("Response retrieved and resolved successfully.")
  const body = resp.body
  const $ = cheerio.load(body)

  const buttonText = $(page.cssSelector).text()
  const soldOut = page.expectedText === buttonText

  console.log(`Button text found: ${buttonText}`)

  return {
    vendor: page.vendor,
    status: soldOut ? Stocked.SOLD_OUT : Stocked.IN_STOCK,
    buttonText: buttonText,
  }
}

export default async (req, res) => {
  console.log(Date.now(), "\n\n\n\n\n\n\n\n\n\n")

  const statuses = await Promise.all(
    schema.map(async (page) => {
      const resp = await getResponseBody(page)
      return resp
    }),
  )

  console.log(statuses)

  res.statusCode = 200
  res.json({ statuses })
}
