import { Asteroid } from "./Schemas/asteroid";

export const angleToRadians = angle => angle * (Math.PI / 180);

export const genNumbInRange = max => {
    return Math.floor(Math.random() * Math.floor(max));
};

export const genNumbBetweenRange = (max, min) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const genRandomDirectionForAsteroid = () => {
    const rand = genNumbInRange(2);
    return rand === 0 ? -1 : 1;
};

export const regularpolygon = (ctx, x, y, radius, sides) => {
    if (sides < 3) { return; }
    ctx.beginPath();
    const a = ((Math.PI * 2) / sides);
    for (let i = 1; i < sides; i++) {
      const setx = x + (radius * Math.cos(a * i));
      const sety = y + (radius * Math.sin(a * i));
      ctx.lineTo(setx, sety);
    }
    ctx.closePath();
  };

export const distanceFormula = (x1, y1, x2, y2) => {
    return Math.abs(
        Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
    );
};

export const asteroidsCollisons = (asteroids: Asteroid[]) => {
    asteroids.forEach((aster, idx) => {
        const asterX = aster.ax;
        const asterY = aster.ay;
        asteroids.slice(idx).forEach(innerAsteroids => {
            const innerAsterX = innerAsteroids.ax;
            const innerAsterY = innerAsteroids.ay;

            const distance = distanceFormula(asterX, asterY, innerAsterX, innerAsterY);

            if (distance <= aster.radius * 2 || distance <= innerAsteroids.radius * 2) {
                aster.changeAsteroidDirection();
                innerAsteroids.changeAsteroidDirection();
            }
        });

    });
};
