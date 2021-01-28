import { NowRequest, NowResponse } from "@vercel/node"

export type Vendor = {
  name: string
  nameSelector: string
  triggerSelector: string
  priceSelector: string
  expectedText: string
}

export enum VendorName {
  BestBuy = "BestBuy",
  MicroCenter = "MicroCenter",
  NewEgg = "NewEgg",
  BHPhoto = "BHPhoto",
  Amazon = "Amazon",
  Aerie = "Aerie",
}

const defVendor = (
  name,
  nameSelector,
  triggerSelector,
  priceSelector,
  expectedText,
) => ({
  name,
  nameSelector,
  triggerSelector,
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
  [VendorName.Aerie]: defVendor(
    VendorName.Aerie,
    ".product-name.cms-aerie-product-name",
    ".qa-product-prices div:nth-child(2)",
    ".product-list-price",
    "Unavailable",
  ),
}

const { BestBuy, MicroCenter, NewEgg, Aerie } = vendors

export interface ProductPage {
  vendor: Vendor
  url: string
}

const defProduct = (vendor, url): ProductPage => ({
  vendor,
  url,
})

export interface ProductPageStatus {
  name: string
  price: string
  status: Stocked
  link: string
  vendorName: string
  triggerText?: string
}
export enum Stocked {
  SOLD_OUT = "SOLD OUT",
  IN_STOCK = "IN STOCK NOW",
}

const dp = (v, link) => defProduct(v, link)

export const schema: ProductPage[] = [
  //   dp(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/617530/powercolor-radeon-rx-5700-xt-liquid-devil-overclocked-liquid-cooled-8gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   dp(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/624719/asus-radeon-rx-5600-xt-evo-top-edition-dual-fan-6gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   dp(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/626833/asus-amd-radeon-rx-5600-xt-tuf-gaming-x3-triple-fan-6gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/626832/asus-radeon-rx-5600-xt-rog-strix-top-edition-overclocked-triple-fan-6gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   defProduct(
  //     BestBuy,
  //     "https://www.bestbuy.com/site/pny-geforce-rtx-3070-8gb-xlr8-gaming-epic-x-rgb-triple-fan-graphics-card/6432653.p?skuId=6432653",
  //   ),
  //   defProduct(
  //     BestBuy,
  //     "https://www.bestbuy.com/site/msi-geforce-rtx-3070-ventus-3x-oc-bv-8gb-gddr6-pci-express-4-0-graphics-card-black/6438278.p?skuId=6438278",
  //   ),
  //   defProduct(
  //     BestBuy,
  //     "https://www.bestbuy.com/site/gigabyte-geforce-rtx-3070-8g-gddr6-pci-express-4-0-graphics-card-white/6439385.p?skuId=6439385",
  //   ),
  //   defProduct(
  //     BestBuy,
  //     "https://www.bestbuy.com/site/asus-tuf-rtx3070-8gb-gddr6-pci-express-4-0-graphics-card-black/6439128.p?skuId=6439128",
  //   ),
  //   defProduct(
  //     BestBuy,
  //     "https://www.bestbuy.com/site/gigabyte-geforce-rtx-3070-8g-gddr6-pci-express-4-0-graphics-card-black/6437909.p?skuId=6437909",
  //   ),
  //   defProduct(
  //     BestBuy,
  //     "https://www.bestbuy.com/site/nvidia-geforce-rtx-3070-8gb-gddr6-pci-express-4-0-graphics-card-dark-platinum-and-black/6429442.p?skuId=6429442",
  //   ),
  //   defProduct(
  //     NewEgg,
  //     "https://www.newegg.com/asus-geforce-rtx-3070-dual-rtx3070-o8g/p/N82E16814126459?Description=3070&cm_re=3070-_-14-126-459-_-Product",
  //   ),
  //   defProduct(
  //     NewEgg,
  //     "https://www.newegg.com/asus-geforce-rtx-3080-rog-strix-rtx3080-o10g-gaming/p/N82E16814126457?Description=3060&cm_re=3060-_-14-126-457-_-Product&quicklink=true",
  //   ),
  //   defProduct(
  //     NewEgg,
  //     "https://www.newegg.com/msi-geforce-rtx-3060-ti-rtx-3060-ti-ventus-2x-oc/p/N82E16814137612?Description=3060&cm_re=3060-_-14-137-612-_-Product&quicklink=true",
  //   ),
  //   defProduct(
  //     NewEgg,
  //     "https://www.newegg.com/msi-geforce-rtx-3080-rtx-3080-gaming-x-trio-10g/p/N82E16814137597?Description=3060&cm_re=3060-_-14-137-597-_-Product&quicklink=true",
  //   ),
  //   defProduct(
  //     NewEgg,
  //     "https://www.newegg.com/evga-geforce-rtx-3070-08g-p5-3751-kr/p/N82E16814487528?Description=rtx%203070&cm_re=rtx_3070-_-14-487-528-_-Product",
  //   ),
  defProduct(
    Aerie,
    "https://www.ae.com/us/en/p/aerie/leggings/7-8-leggings/offline-real-me-high-waisted-crossover-legging/0708_4743_073",
  ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/630201/msi-geforce-rtx-3070-gaming-x-trio-triple-fan-8gb-gddr6-pcie-40-graphics-card?storeid=171",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/630202/msi-geforce-rtx-3070-ventus-3x-overclocked-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/630578/evga-geforce-rtx-3070-xc3-ultra-gaming-triple-fan-8gb-gddr6-pcie-40-graphics-card?storeid=171",
  //   ),

  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/630684/asus-geforce-rtx-3070-tuf-overclocked-triple-fan-8gb-gddr6-pcie-40-graphics-card?storeid=171",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/630033/gigabyte-geforce-rtx-3070-gaming-overclocked-triple-fan-8gb-gddr6-pcie-40-graphics-card?storeid=171",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/630035/gigabyte-geforce-rtx-3070-eagle-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/611394/gigabyte-geforce-rtx-2070-super-gaming-oc-3x-overclocked-triple-fan-8gb-gddr6-pcie-30-graphics-card",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/631532/msi-geforce-rtx-3060-ti-ventus-2x-overclocked-dual-fan-8gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/631716/nvidia-geforce-rtx-3060-ti-founders-edition-dual-fan-8gb-gddr6-pcie-40-graphics-card",
  //   ),
  //   defProduct(
  //     MicroCenter,
  //     "https://www.microcenter.com/product/631926/evga-geforce-rtx-3060-ti-ftw-ultra-gaming-triple-fan-8gb-gddr6-pcie-40-graphics-card",
  //   ),
  dp(
    MicroCenter,
    "https://www.microcenter.com/product/631510/apple-mac-mini-mgnr3ll-a-(late-2020)-desktop-computer",
  ),
  defProduct(
    BestBuy,
    "https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149",
  ),
]

const redirectInvalidRoute = (req, res: NowResponse) => {
  res.status(403)
  return res.end("Forbidden route")
}

export default redirectInvalidRoute
