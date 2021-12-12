import { Wheel } from "../types";

const HALF_PI = Math.PI / 2.0;
const TWO_PI = Math.PI * 2.0;
const THREE_PI_OVER_FOUR = 3 * Math.PI / 4.0
const QUARTER_PI = Math.PI / 4.0;
const FOUR_BY_PI = 4.0 / Math.PI;

function sineAndBump(theta: number, nodes: number = 4): number {
  theta *= nodes;
  theta %= TWO_PI;
  if (theta < 1) {
    return Math.sqrt(1 - theta ** 2)
  }
  if (theta > TWO_PI - 1) {
    theta -= TWO_PI;
    return Math.sqrt(1 - theta ** 2)
  }
  return 0.5 * (Math.sin((TWO_PI /(TWO_PI - 2.0)) * (theta - 1.0) - HALF_PI ) + 1)
}

const wheels: Record<string, Wheel> = {
  'sine24': function (theta) {
    return (1 + Math.sin(24 * theta + HALF_PI)) / 2.0;
  },
  'sine22': function (theta) {
    return (1 + Math.sin(22 * theta + HALF_PI)) / 2.0;
  },
  'sine20': function (theta) {
    return (1 + Math.sin(20 * theta + HALF_PI)) / 2.0;
  },
  'sine18': function (theta) {
    return (1 + Math.sin(18 * theta + HALF_PI)) / 2.0;
  },
  'sine16': function (theta) {
    return (1 + Math.sin(16 * theta + HALF_PI)) / 2.0;
  },
  'sine14': function (theta) {
    return (1 + Math.sin(14 * theta + HALF_PI)) / 2.0;
  },
  'sine12': function (theta) {
    return (1 + Math.sin(12 * theta + HALF_PI)) / 2.0;
  },
  'saw12': function (theta) {
    return Math.abs((((3 * theta) % HALF_PI) - QUARTER_PI) * FOUR_BY_PI)
  },
  'saw14': function (theta) {
    return Math.abs((((3.5 * theta) % HALF_PI) - QUARTER_PI) * FOUR_BY_PI)
  },
  'saw16': function (theta) {
    return Math.abs((((4 * theta) % HALF_PI) - QUARTER_PI) * FOUR_BY_PI)
  },
  'saw18': function (theta) {
    return Math.abs((((4.5 * theta) % HALF_PI) - QUARTER_PI) * FOUR_BY_PI)
  },
  'saw20': function (theta) {
    return Math.abs((((5 * theta) % HALF_PI) - QUARTER_PI) * FOUR_BY_PI)
  },
  'saw22': function (theta) {
    return Math.abs((((5.5 * theta) % HALF_PI) - QUARTER_PI) * FOUR_BY_PI)
  },
  'saw24': function (theta) {
    return Math.abs((((6 * theta) % HALF_PI) - QUARTER_PI) * FOUR_BY_PI)
  },
  'bumps24': function (theta) {
    return Math.abs(Math.sin(12 * theta + HALF_PI));
  },
  'bumps22': function (theta) {
    return Math.abs(Math.sin(11 * theta + HALF_PI));
  },
  'bumps20': function (theta) {
    return Math.abs(Math.sin(10 * theta + HALF_PI));
  },
  'bumps18': function (theta) {
    return Math.abs(Math.sin(9 * theta + HALF_PI));
  },
  'bumps16': function (theta) {
    return Math.abs(Math.sin(8 * theta + HALF_PI));
  },
  'bumps14': function (theta) {
    return Math.abs(Math.sin(7 * theta + HALF_PI));
  },
  'bumps12': function (theta) {
    return Math.abs(Math.sin(6 * theta + HALF_PI));
  },
  'pins24': function (theta) {
    return 1.0 - Math.abs(Math.sin(12 * theta + HALF_PI));
  },
  'pins22': function (theta) {
    return 1.0 - Math.abs(Math.sin(11 * theta + HALF_PI));
  },
  'pins20': function (theta) {
    return 1.0 - Math.abs(Math.sin(10 * theta + HALF_PI));
  },
  'pins18': function (theta) {
    return 1.0 - Math.abs(Math.sin(9 * theta + HALF_PI));
  },
  'pins16': function (theta) {
    return 1.0 - Math.abs(Math.sin(8 * theta + HALF_PI));
  },
  'pins14': function (theta) {
    return 1.0 - Math.abs(Math.sin(7 * theta + HALF_PI));
  },
  'pins12': function (theta) {
    return 1.0 - Math.abs(Math.sin(6 * theta + HALF_PI));
  },
  'bumpsine3': function (theta) {
    return sineAndBump(theta, 3);
  },
  'bumpsine4': function (theta) {
    return sineAndBump(theta, 4);
  },
  'bumpsine5': function (theta) {
    return sineAndBump(theta, 5);
  },
  'bumpsine6': function (theta) {
    return sineAndBump(theta, 6);
  },
  'bumpsine8': function (theta) {
    return sineAndBump(theta, 8);
  },
  'bumpsine10': function (theta) {
    return sineAndBump(theta, 10);
  },
  'bumpsine12': function (theta) {
    return sineAndBump(theta, 12);
  },
  'bumpsine14': function (theta) {
    return sineAndBump(theta, 14);
  },
  'bumpsine16': function (theta) {
    return sineAndBump(theta, 16);
  }
};

export default wheels;
