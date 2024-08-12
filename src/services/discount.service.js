/** Discount service
 * 1. Generator discount code [Shop | Admin]
 * 2. Get all discount codes [User | Shop]
 * 3. Get all product by discount doe [User]
 * 4. Get discount amount [User]
 * 5. Delete discount code [Shop | Admin]
 * 6. Cancel discount code [User]
 */

import { BadRequestError, NotFoundError } from '../core/error.response.js';
import discountModel from '../models/discount.model.js';
import {
  checkDiscountExits,
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
} from '../models/repositories/discount.repo.js';
import { findAllProducts } from '../models/repositories/product.repo.js';
import { convertToObjectIdMongoDB } from '../utils/index.js';

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applied_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      max_uses_per_user,
      uses_count,
      users_used,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new NotFoundError('Discount code has expired');
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new NotFoundError('Discount code has expired');
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount exists');
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_value: max_value,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applied_to: applied_to,
      discount_product_ids: applied_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscount(discountId, payload) {
    return await discountModel
      .findByIdAndUpdate({ _id: convertToObjectIdMongoDB(discountId) }, payload, { new: true })
      .lean();
  }

  // Get all discount codes available with products
  static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDB(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exits');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoDB(shopId),
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongoDB(shopId),
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discountModel,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExits(discountModel, {
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });

    if (!foundDiscount) throw new NotFoundError('Discount not exits');

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_users_used,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError('Discount expired');
    if (discount_max_uses === 0) throw new NotFoundError('Discount are out');

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('Discount ecode has expired');
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount require a minimum order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find((user) => user.userId === userId);
      if (userUseDiscount) {
        //...
      }
    }

    // check discount is 'fixed amount' or 'percentage'
    const amount =
      discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }  
  }
}
