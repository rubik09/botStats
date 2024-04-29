import { TUniqueActivities } from './types';
import { Keyword } from '../keywords/entity/keywords.entity';

export const combineKeywords = (keywords: Keyword[]) => {
  return Object.values(
    keywords.reduce((uniqueActivities: TUniqueActivities, keyword: Keyword) => {
      const { activity, count } = keyword;
      uniqueActivities[activity]
        ? ((uniqueActivities[activity].count += count), uniqueActivities[activity].keywords.push(keyword))
        : (uniqueActivities[activity] = {
            ...keyword,
            keywords: [keyword],
          });
      return uniqueActivities;
    }, {}),
  );
};
