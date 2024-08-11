import inventoryModel from "../inventory.model.js"
import { Types } from "mongoose"

export const insertInventory = async({productId, shopId, stock, location = 'un known'}) => {
   return await inventoryModel.create({
      inventory_productId: productId,
      inventory_stock: stock,
      inventory_location: location,
      inventory_shopId: shopId
   })
}

