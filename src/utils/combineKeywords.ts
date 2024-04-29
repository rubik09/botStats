import { TUniqueActivities } from './types';
import { Keyword } from '../keywords/entity/keywords.entity';

export const combineKeywords = (keywords: Keyword[]) => {
  console.log(keywords);
  return Object.values(
    keywords.reduce((uniqueActivities: TUniqueActivities, keyword: Keyword) => {
      const { activity, count } = keyword;
      if (uniqueActivities[activity]) {
        uniqueActivities[activity].count += count;
        uniqueActivities[activity].keywords.push(keyword);
      } else {
        uniqueActivities[activity] = {
          ...keyword,
          keywords: [keyword],
        };
      }
      return uniqueActivities;
    }, {}),
  );
};
