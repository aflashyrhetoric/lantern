export type Vendor = {
  name: string
  nameSelector: string
  buttonSelector: string
  priceSelector: string
  expectedText: string
}

export enum VendorName {
  BestBuy = "BestBuy",
  MicroCenter = "MicroCenter",
  NewEgg = "NewEgg",
  BHPhoto = "BHPhoto",
  Amazon = "Amazon",
}

const defVendor = (
  name,
  nameSelector,
  buttonSelector,
  priceSelector,
  expectedText,
) => ({
  name,
  nameSelector,
  buttonSelector,
  priceSelector,
  expectedText,
})

const vendors = {
  [VendorName.BestBuy]: defVendor(
    VendorName.BestBuy,
    ".sku-title h1",
    ".fulfillment-add-to-cart-button button",
    ".priceView-customer-price span",
    "Sold Out",
  ),
  [VendorName.NewEgg]: defVendor(
    VendorName.NewEgg,
    ".product-title",
    ".product-buy .btn-message",
    ".price-current",
    "Sold Out",
  ),
  [VendorName.MicroCenter]: defVendor(
    VendorName.MicroCenter,
    ".summary h1",
    ".inventory .inventoryCnt",
    "#pricing",
    "Sold Out",
  ),
  [VendorName.BHPhoto]: defVendor(
    VendorName.BHPhoto,
    "[data-selenium=productTitle]",
    "[data-selenium=notifyAvailabilityButton]",
    "[data-selenium=pricingPrice]",
    "Notify When Available",
  ),
}

const { BestBuy, MicroCenter, NewEgg } = vendors

export interface ProductPage {
  vendor: Vendor
  url: string
}

const defProduct = (vendor, url): ProductPage => ({
  vendor,
  url,
})

export const options = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
  },
  http2: true,
}

export interface ProductPageStatus {
  name: string
  price: number
  status: Stocked
  link: string
  vendorName: string
}
export enum Stocked {
  SOLD_OUT = "SOLD OUT",
  IN_STOCK = "IN STOCK NOW",
}

export const schema: ProductPage[] = [
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/pny-geforce-rtx-3070-8gb-xlr8-gaming-epic-x-rgb-triple-fan-graphics-card/6432653.p?skuId=6432653",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/asus-tuf-rtx3070-8gb-gddr6-pci-express-4-0-graphics-card-black/6439128.p?skuId=6439128",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/msi-geforce-rtx-3070-ventus-3x-oc-bv-8gb-gddr6-pci-express-4-0-graphics-card-black/6438278.p?skuId=6438278",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/gigabyte-geforce-rtx-3070-8g-gddr6-pci-express-4-0-graphics-card-white/6439385.p?skuId=6439385",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/asus-tuf-rtx3070-8gb-gddr6-pci-express-4-0-graphics-card-black/6439128.p?skuId=6439128",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/gigabyte-geforce-rtx-3070-8g-gddr6-pci-express-4-0-graphics-card-black/6437909.p?skuId=6437909",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/nvidia-geforce-rtx-3070-8gb-gddr6-pci-express-4-0-graphics-card-dark-platinum-and-black/6429442.p?skuId=6429442",
  ),
  defProduct(
    NewEgg,
    "https://www.newegg.com/asus-geforce-rtx-3070-dual-rtx3070-o8g/p/N82E16814126459?Description=3070&cm_re=3070-_-14-126-459-_-Product",
  ),
  defProduct(
    NewEgg,
    "https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3751-kr/p/N82E16814487528?Description=rtx%203070&cm_re=rtx_3070-_-14-487-528-_-Product",
  ),
  defProduct(
    MicroCenter,
    "https://www.microcenter.com/product/630201/msi-geforce-rtx-3070-gaming-x-trio-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  ),
  // defProduct(
  //   MicroCenter,
  //   "https://www.microcenter.com/product/630202/msi-geforce-rtx-3070-ventus-3x-overclocked-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  // ),
  defProduct(
    MicroCenter,
    "https://www.microcenter.com/product/630578/evga-geforce-rtx-3070-xc3-ultra-gaming-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  ),

  defProduct(
    MicroCenter,
    "https://www.microcenter.com/product/630684/asus-geforce-rtx-3070-tuf-overclocked-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  ),
  defProduct(
    MicroCenter,
    "https://www.microcenter.com/product/630033/gigabyte-geforce-rtx-3070-gaming-overclocked-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  ),
  defProduct(
    MicroCenter,
    "https://www.microcenter.com/product/630035/gigabyte-geforce-rtx-3070-eagle-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  ),
  defProduct(
    MicroCenter,
    "https://www.microcenter.com/product/611394/gigabyte-geforce-rtx-2070-super-gaming-oc-3x-overclocked-triple-fan-8gb-gddr6-pcie-30-graphics-card",
  ),
]
