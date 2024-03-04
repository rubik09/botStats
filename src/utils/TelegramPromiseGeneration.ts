import { IPromiseValue, IPromises } from './interfaces';

export default function generatePromise(): IPromises[number] {
  let resolve: (value: IPromiseValue) => void;
  const promise = new Promise<IPromiseValue>((res) => {
    resolve = res;
  });

  return { resolve, promise };
}
