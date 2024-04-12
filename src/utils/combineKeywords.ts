import { TUniqueActivities } from './types';
import { Keyword } from '../keywords/entity/keywords.entity';

export const combineKeywords = (keywords: Keyword[]) => {
  const uniqueActivities: TUniqueActivities = {};

  keywords.forEach((keyword) => {
    if (!uniqueActivities[keyword.activity]) {
      uniqueActivities[keyword.activity] = { ...keyword };
    } else {
      uniqueActivities[keyword.activity].count += keyword.count;
    }
  });

  return Object.values(uniqueActivities);
};
