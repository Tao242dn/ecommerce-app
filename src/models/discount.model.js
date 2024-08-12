import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: 'fixed_amount', // percentage
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      // Day start discount
      type: Date,
      required: true,
    },
    discount_end_date: {
      // Day end discount
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // Max times can be used
      type: Number,
      required: true,
    },
    discount_uses_count: {
      // Times used by per user
      type: Number,
      required: true,
    },
    discount_users_used: {
      // Who used this discount
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      // Max times can be used per user
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applied_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: {
      // How many products can be applied by this discount
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, discountSchema);
