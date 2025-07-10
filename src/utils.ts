function isNotNullAndSuperior(arg: any){
  return arg != null && arg > 0;
}

function randomValue(min: number, max: number){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    isNotNullAndSuperior,
    randomValue,
}