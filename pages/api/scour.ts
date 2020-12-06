// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import cheerio from "cheerio"
import got from "got"
import {
  schema,
  options,
  ProductPage,
  ProductPageStatus,
  Stocked,
} from "../../shared"

const getResponseBody = async (
  productPage: ProductPage,
): Promise<ProductPageStatus> => {
  const resp = await got(productPage.url, options)
  console.log("Response retrieved and resolved successfully.")
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

  const productName = $(nameSelector).text()
  const buttonText = $(buttonSelector).text()
  const price = $(priceSelector).text()
  const soldOut = expectedText === buttonText && buttonText !== ""

  // console.log(`Button text found: ${buttonText}`)

  return {
    vendorName: name,
    name: productName,
    price,
    status: soldOut ? Stocked.SOLD_OUT : Stocked.IN_STOCK,
    // buttonText: buttonText,
    link: productPage.url,
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

  // console.log(statuses)

  res.statusCode = 200
  res.json({ statuses })
}
