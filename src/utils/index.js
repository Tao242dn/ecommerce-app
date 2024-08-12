'use strict';

import _ from 'lodash';
import { Types } from 'mongoose';

export const convertToObjectIdMongoDB = id => Types.ObjectId(id);

export const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

export const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

export const removeNullObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null) {
      delete obj[k];
    }
  });

  return obj;
};

export const updateNestedObjectParser = (obj) => {
  const final = {};
  const cleanObj = removeNullObject(obj);
  Object.keys(cleanObj).forEach((k) => {
    if (typeof cleanObj[k] === 'object' && !Array.isArray(cleanObj[k])) {
      const response = updateNestedObjectParser(cleanObj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = cleanObj[k];
    }
  });
  return final;
};
