export enum Vendor {
  BestBuy = "Best Buy",
  MicroCenter = "MicroCenter",
  NewEgg = "NewEgg",
  BHPhoto = "BHPhoto",
  Amazon = "Amazon",
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
    "https://www.bestbuy.com/site/pny-geforce-rtx-3070-8gb-xlr8-gaming-epic-x-rgb-triple-fan-graphics-card/6432653.p?skuId=6432653",
    "Sold Out",
    ".fulfillment-add-to-cart-button button",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/asus-tuf-rtx3070-8gb-gddr6-pci-express-4-0-graphics-card-black/6439128.p?skuId=6439128",
    "Sold Out",
    ".fulfillment-add-to-cart-button button",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/msi-geforce-rtx-3070-ventus-3x-oc-bv-8gb-gddr6-pci-express-4-0-graphics-card-black/6438278.p?skuId=6438278",
    "Sold Out",
    ".fulfillment-add-to-cart-button button",
  ),
  defProduct(
    NewEgg,
    "https://www.newegg.com/asus-geforce-rtx-3070-dual-rtx3070-o8g/p/N82E16814126459?Description=3070&cm_re=3070-_-14-126-459-_-Product",
    "Sold Out",
    ".product-buy .btn-message",
  ),
  defProduct(
    NewEgg,
    "https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3751-kr/p/N82E16814487528?Description=rtx%203070&cm_re=rtx_3070-_-14-487-528-_-Product",
    "Sold Out",
    ".product-buy .btn-message",
  ),
  defProduct(
    MicroCenter,
    "https://www.microcenter.com/product/630201/msi-geforce-rtx-3070-gaming-x-trio-triple-fan-8gb-gddr6-pcie-40-graphics-card",
    "Sold Out",
    ".inventory .inventoryCnt",
  ),
]

export const options = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
  },
  http2: true,
}

export interface ProductPageStatus {
  vendor: Vendor
  status: Stocked
  buttonText: string
  link: string
}
export enum Stocked {
  SOLD_OUT = "SOLD OUT",
  IN_STOCK = "IN STOCK NOW",
}
