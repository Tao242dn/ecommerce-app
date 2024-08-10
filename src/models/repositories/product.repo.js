import modelSchema from '../product.model.js';
import { Types } from 'mongoose';

export const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

export const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

export const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await modelSchema.productModel
    .find({ isPublish: true, $text: { $search: regexSearch } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return results;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await modelSchema.productModel
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await modelSchema.productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublish = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

export const unPublishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await modelSchema.productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublish = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
