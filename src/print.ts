import { clearDown, goUp, goLeft, write } from "https://denopkg.com/iamnathanj/cursor@v2.0.0/mod.ts";

export async function print(message: string) {
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
