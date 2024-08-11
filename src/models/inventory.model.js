import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema({
    inventory_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    inventory_location: {
        type: String,
        default: 'un known'
    },
    inventory_stock: {
        type: Number,
        required: true,
    },
    inventory_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    inventory_reservations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default model(DOCUMENT_NAME, inventorySchema)