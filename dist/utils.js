function isNotNullAndSuperior(arg) {
    return arg != null && arg > 0;
}
function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default {
    isNotNullAndSuperior,
    randomValue,
};
