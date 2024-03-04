import { IPromises, IPromiseValue } from "./interfaces";

export default function generatePromise(): IPromises[number] {
  let resolve: (value: IPromiseValue) => void;
  let promise = new Promise<IPromiseValue>((res) => {
    resolve = res;
  });

  return { resolve, promise };
}
