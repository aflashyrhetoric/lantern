export enum Vendor {
  BestBuy = "bestbuy",
  MicroCenter = "microcenter",
  NewEgg = "newegg",
  BHPhoto = "bhphoto",
  Amazon = "amazon",
}

const { BestBuy, MicroCenter, NewEgg, BHPhoto, Amazon } = Vendor

export interface ProductPage {
  vendor: Vendor
  url: string
  expectedText: string
  cssSelector: string
}

const defProduct = (vendor, url, expectedText, cssSelector): ProductPage => ({
  vendor,
  url,
  expectedText,
  cssSelector,
})

export const schema: ProductPage[] = [
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/msi-geforce-rtx-3070-ventus-3x-oc-bv-8gb-gddr6-pci-express-4-0-graphics-card-black/6438278.p?skuId=6438278",
    "Sold Out",
    ".fulfillment-add-to-cart-button button",
  ),
]

export const options = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
  },
  http2: true,
}
