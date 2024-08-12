import { getSelectData, unGetSelectData } from '../../utils/index.js';

export const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
  model,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return products;
};

export const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

export const checkDiscountExits = async (model, filter) => {
  return await model.findOne(filter).lean();
};
