import {Keywords} from "../keywords/entity/keywords.entity";
import {TUniqueActivities} from "./types";

export const combineKeywords = (keywords: Keywords[]) => {
    const uniqueActivities: TUniqueActivities = {};

    keywords.forEach(keyword => {
        if (!uniqueActivities[keyword.activity]) {
            uniqueActivities[keyword.activity] = { ...keyword };
        } else {
            uniqueActivities[keyword.activity].count += keyword.count;
        }
    });

    return Object.values(uniqueActivities);
}
