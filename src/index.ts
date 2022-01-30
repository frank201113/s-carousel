interface Person {
  name: string;
  age: number;
}

export function getAge(param: Person): Promise<number> {
  return new Promise<number>(resolve => {
    resolve(param.age)
  })
}
