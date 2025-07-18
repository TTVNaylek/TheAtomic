function isNotNullAndSuperior(arg: any) : boolean{
    return arg != null && arg > 0;
};

function randomValue(min: number, max: number) : number{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default {
    isNotNullAndSuperior,
    randomValue,
};