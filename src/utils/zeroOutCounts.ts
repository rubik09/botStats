type keywordsObjType = {
    activity: string;
    keyword: number;
    count: number;
};

export default (arr: keywordsObjType[]) => {
    return arr.map((obj: keywordsObjType) => ({...obj, count: 0}));
}
