const keyby = (arr, key) => arr.reduce((acc, el) => {
    acc[el[key]] = el
    return acc
}, {});

module.exports = {
    keyby,
}