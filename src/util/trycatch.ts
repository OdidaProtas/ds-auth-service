import { User } from "../entity/User";

export default async function (promise: Promise<any>) {
  try {
    return [await promise, null];
  } catch (e) {
    return [null, e];
  }
}
