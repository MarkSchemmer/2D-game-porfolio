import { Asteroid } from "./Schemas/asteroid";

export const angleToRadians = angle => angle * (Math.PI / 180);

export const genNumbInRange = max => {
    return Math.floor(Math.random() * Math.floor(max));
};

export const genNumbBetweenRange = (min, max) => {
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

export const distanceFormulaWithoutAbs = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
};

export const calcAngle = (a1: Asteroid, a2: Asteroid) => {
    const dx = a2.ax - a1.ax;
    const dy = a2.ay - a1.ay;
    const angle = Math.atan2(dx, dy) * 180 / Math.PI;
    return angle < 0 ? angle + 360 : angle;
};

export const calcNewVelocitys = (a1: Asteroid, a2: Asteroid) => {
    const x1 = (a1.vx * (a1.mass - a2.mass) + (2 * a2.mass * a2.vx)) / (a1.mass + a2.mass);
    const y1 = (a1.vy * (a1.mass - a2.mass) + (2 * a2.mass * a2.vy)) / (a1.mass + a2.mass);
    const x2 = (a2.vx * (a2.mass - a1.mass) + (2 * a1.mass * a1.vx)) / (a1.mass + a2.mass);
    const y2 = (a2.vy * (a2.mass - a1.mass) + (2 * a1.mass * a1.vy)) / (a1.mass + a2.mass);
    return {
        newVx1: x1,
        newVy1: y1,
        newVx2: x2,
        newVy2: y2
    };
};

// Need to add function so it doesn't check same asteroid twice
// Need to add id to asteroid so unique id is generated for every asteroid
// Filter out asteroid

export const asteroidsCollisons = (asteroids: Asteroid[]) => {
    asteroids.forEach((aster, idx) => {
        const asterX = aster.ax;
        const asterY = aster.ay;
        asteroids.slice(idx + 1).forEach(innerAsteroid => {
            const innerAsterX = innerAsteroid.ax;
            const innerAsterY = innerAsteroid.ay;

            const distance = distanceFormulaWithoutAbs(asterX, asterY, innerAsterX, innerAsterY);

            const rad1 = aster.radius;
            const rad2 = innerAsteroid.radius;

            if (distance < (rad1 + rad2)) {
                const { newVx1, newVy1, newVx2, newVy2 } = calcNewVelocitys(aster, innerAsteroid);
                aster.changeAsteroidDirection(newVx1, newVy1);
                innerAsteroid.changeAsteroidDirection(newVx2, newVy2);
            }
        });

    });
};

export const asteroidRandomGenerator = ctx => {
    return [
        new Asteroid(ctx, 0, genNumbBetweenRange(0, 100)),
        new Asteroid(ctx, 0, genNumbBetweenRange(175, 300)),
        new Asteroid(ctx, 0, genNumbBetweenRange(375, 450)),
        new Asteroid(ctx, 0, genNumbBetweenRange(500, 650)),
        new Asteroid(ctx, genNumbBetweenRange(0, 100), 0),
        new Asteroid(ctx, genNumbBetweenRange(175, 300), 0),
        new Asteroid(ctx, genNumbBetweenRange(350, 400), 0),
        new Asteroid(ctx, genNumbBetweenRange(450, 550), 0),
        new Asteroid(ctx, genNumbBetweenRange(600, 750), 0)
    ];
};
