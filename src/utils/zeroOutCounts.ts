export default (arr) => {
    return arr.map(obj => ({...obj, count: 0}));
}
