import {clearDown, goLeft, goUp, hideCursor, readLines, showCursor, write} from "../../dep.ts";

export async function print(message: string) {
    await write(message);
}

export async function printInteractive(message: string) {
    const lines = message.split("\n");
    const numberOfLines = lines.length;
    const lengthOfLastLine = lines[numberOfLines - 1].length;

    await clearDown();
    await write(message)
    await goLeft(lengthOfLastLine);

    if (numberOfLines > 1) {
        await goUp(numberOfLines - 1);
    }
}

export async function ask(question: string): Promise<string> {
    showCursor();
    await clearDown();
    write(question);

    for await (const line of readLines(Deno.stdin)) {
        await goLeft(question.length + line.length);
        await goUp(1);
        hideCursor();
        return line;
    }

    return '';
}
