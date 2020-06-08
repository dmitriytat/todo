export function leftPad(message: string, length: number, character: string = ' ') {
    if (message.length >= length) {
        return message;
    }

    let pad = '';
    for (let i = message.length; i < length; i++) {
        pad = character + pad;
    }

    return pad + message;
}
