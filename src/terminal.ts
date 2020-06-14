import { decode, encode } from "https://deno.land/std/encoding/utf8.ts";
import {
  clearDown,
  goUp,
  goLeft,
} from "https://denopkg.com/iamnathanj/cursor@v2.0.0/mod.ts";

export async function print(message: string) {
  await Deno.stdout.write(encode(message));
}

export async function printLines(message: string) {
  await print(message + "\n");
}

export async function printInteractive(message: string) {
  const lines = message.split("\n");
  const numberOfLines = lines.length;
  const lengthOfLastLine = lines[numberOfLines - 1].length;

  await clearDown();
  await print(message);
  await goLeft(lengthOfLastLine);

  if (numberOfLines > 1) {
    await goUp(numberOfLines - 1);
  }
}

export async function readLine(): Promise<string> {
  const buffer = new Uint8Array(1024);
  const length = <number> await Deno.stdin.read(buffer);
  return decode(buffer.subarray(0, length - 1));
}

export async function prompt(question: string): Promise<string> {
  await clearDown();
  await print(question);
  const answer = await readLine();
  await goLeft(question.length + answer.length);
  await goUp(1);

  return answer;
}

export async function readKeypress(): Promise<string> {
  const buffer = new Uint8Array(1024);
  Deno.setRaw(Deno.stdin.rid, true);
  const length = <number> await Deno.stdin.read(buffer);
  Deno.setRaw(Deno.stdin.rid, false);

  return decode(buffer.subarray(0, length));
}
