import { isValue } from "utils/Utils";

const paused = "Game is paused ";
const active = "Game is Active ";
const textSize = "20px";
const fontStyle = "Arial";

export const drawIsGameActiveText = ctx => isGamePaused => {
    const font = textSize + " " + fontStyle;
    const gameText = isGamePaused ? active : paused;
    // ctx.save();
    ctx.font = font;
    ctx.fillStyle = "white";
    // ctx.rotate(Math.PI / 2);
    ctx.fillText(gameText, 0, 0);
};

export const giveTextForDiv = isGamePaused => {
    const gameText = isValue(isGamePaused) ? active : paused;
    return gameText;
};
