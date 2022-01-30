export function getAge(param) {
    return new Promise(function (resolve) {
        resolve(param.age);
    });
}
