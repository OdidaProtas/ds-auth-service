import { randomInt } from "crypto";

export default function generateVerificationCode() {
  return randomInt(1000_000).toString().padStart(6, "0");
}
