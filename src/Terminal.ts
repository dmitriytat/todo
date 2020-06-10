import { clearDown, decode, encode, goLeft, goUp } from "../dep.ts";

export class Terminal {
  async print(message: string) {
    await Deno.stdout.write(encode(message));
  }

  async printLines(message: string) {
    await this.print(message + '\n');
  }

  async printInteractive(message: string) {
    const lines = message.split("\n");
    const numberOfLines = lines.length;
    const lengthOfLastLine = lines[numberOfLines - 1].length;

    await clearDown();
    await this.print(message);
    await goLeft(lengthOfLastLine);

    if (numberOfLines > 1) {
      await goUp(numberOfLines - 1);
    }
  }

  async readLine(): Promise<string> {
    const buffer = new Uint8Array(1024);
    const length = <number> await Deno.stdin.read(buffer);
    return decode(buffer.subarray(0, length - 1));
  }

  async prompt(question: string): Promise<string> {
    await clearDown();
    await this.print(question);
    const answer = await this.readLine();
    await goLeft(question.length + answer.length);
    await goUp(1);

    return answer;
  }

  async readKeypress(): Promise<string> {
    const buffer = new Uint8Array(1024);
    Deno.setRaw(Deno.stdin.rid, true);
    const length = <number> await Deno.stdin.read(buffer);
    Deno.setRaw(Deno.stdin.rid, false);

    return decode(buffer.subarray(0, length));
  }
}
