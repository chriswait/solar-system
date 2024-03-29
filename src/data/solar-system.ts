// textures from https://www.solarsystemscope.com/textures/
import Sun from "../images/sun.jpg";
import Mercury from "../images/mercury.jpg";
import Venus from "../images/venus.jpg";
import Earth from "../images/earth.jpg";
import Mars from "../images/mars.jpg";
import Jupiter from "../images/jupiter.jpg";
import Saturn from "../images/saturn.jpg";
import Uranus from "../images/uranus.jpg";
import Neptune from "../images/neptune.jpg";
// from http://www.fedtrek.com/staff/omega13a/celestia/omega_galaxy/textures/medres/pluto4.jpg
import Pluto from "../images/pluto.jpg";
import { SolarSystemObject } from "../types";

export const SolarSystemObjects = [
  {
    name: "sun",
    radius: 695700,
    color: "#fffc9d",
    map: Sun,
    star: {},
  },
  {
    name: "mercury",
    radius: 2440,
    color: "#c09071",
    map: Mercury,
    orbit: {
      siderealYears: 0.240846,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 0.38709927,
          eccentricityRadians: 0.20563593,
          inclinationDegrees: 7.00497902,
          meanLongitudeDegrees: 252.2503235,
          periapsisLongitudeDegrees: 77.45779628,
          ascendingNodeLongitudeDegrees: 48.33076593,
        },
        rates: {
          semiMajorAxisAu: 3.7e-7,
          eccentricityRadians: 0.00001906,
          inclinationDegrees: -0.00594749,
          meanLongitudeDegrees: 149472.67411175,
          periapsisLongitudeDegrees: 0.16047689,
          ascendingNodeLongitudeDegrees: -0.12534081,
        },
      },
    },
  },
  {
    name: "venus",
    radius: 6052,
    color: "#f2c1c5",
    map: Venus,
    orbit: {
      siderealYears: 0.615,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 0.72333566,
          eccentricityRadians: 0.00677672,
          inclinationDegrees: 3.39467605,
          meanLongitudeDegrees: 181.9790995,
          periapsisLongitudeDegrees: 131.60246718,
          ascendingNodeLongitudeDegrees: 76.67984255,
        },
        rates: {
          semiMajorAxisAu: 0.0000039,
          eccentricityRadians: -0.00004107,
          inclinationDegrees: -0.0007889,
          meanLongitudeDegrees: 58517.81538729,
          periapsisLongitudeDegrees: 0.00268329,
          ascendingNodeLongitudeDegrees: -0.27769418,
        },
      },
    },
  },
  {
    name: "earth",
    radius: 6371,
    color: "#70cbe9",
    map: Earth,
    orbit: {
      siderealYears: 1,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 1.00000261,
          eccentricityRadians: 0.01671123,
          inclinationDegrees: -0.00001531,
          meanLongitudeDegrees: 100.46457166,
          periapsisLongitudeDegrees: 102.93768193,
          ascendingNodeLongitudeDegrees: 0,
        },
        rates: {
          semiMajorAxisAu: 0.00000562,
          eccentricityRadians: -0.00004392,
          inclinationDegrees: -0.01294668,
          meanLongitudeDegrees: 35999.37244981,
          periapsisLongitudeDegrees: 0.32327364,
          ascendingNodeLongitudeDegrees: 0,
        },
      },
    },
  },
  {
    name: "mars",
    radius: 3390,
    color: "#d54734",
    map: Mars,
    orbit: {
      siderealYears: 1.881,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 1.52371034,
          eccentricityRadians: 0.0933941,
          inclinationDegrees: 1.84969142,
          meanLongitudeDegrees: -4.55343205,
          periapsisLongitudeDegrees: -23.94362959,
          ascendingNodeLongitudeDegrees: 49.55953891,
        },
        rates: {
          semiMajorAxisAu: 0.00001847,
          eccentricityRadians: 0.00007882,
          inclinationDegrees: -0.00813131,
          meanLongitudeDegrees: 19140.30268499,
          periapsisLongitudeDegrees: 0.44441088,
          ascendingNodeLongitudeDegrees: -0.29257343,
        },
      },
    },
  },
  {
    name: "jupiter",
    radius: 69911,
    color: "#fef0a9",
    map: Jupiter,
    orbit: {
      siderealYears: 11.86,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 5.202887,
          eccentricityRadians: 0.04838624,
          inclinationDegrees: 1.30439695,
          meanLongitudeDegrees: 34.39644051,
          periapsisLongitudeDegrees: 14.72847983,
          ascendingNodeLongitudeDegrees: 100.47390909,
        },
        rates: {
          semiMajorAxisAu: -0.00011607,
          eccentricityRadians: -0.00013253,
          inclinationDegrees: -0.00183714,
          meanLongitudeDegrees: 3034.74612775,
          periapsisLongitudeDegrees: 0.21252668,
          ascendingNodeLongitudeDegrees: 0.20469106,
        },
      },
    },
  },
  {
    name: "saturn",
    radius: 58232,
    color: "#dc9e7c",
    map: Saturn,
    orbit: {
      siderealYears: 29.46,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 9.53667594,
          eccentricityRadians: 0.05386179,
          inclinationDegrees: 2.48599187,
          meanLongitudeDegrees: 49.95424423,
          periapsisLongitudeDegrees: 92.59887831,
          ascendingNodeLongitudeDegrees: 113.66242448,
        },
        rates: {
          semiMajorAxisAu: -0.0012506,
          eccentricityRadians: -0.00050991,
          inclinationDegrees: 0.00193609,
          meanLongitudeDegrees: 1222.49362201,
          periapsisLongitudeDegrees: -0.41897216,
          ascendingNodeLongitudeDegrees: -0.28867794,
        },
      },
    },
  },
  {
    name: "uranus",
    radius: 25362,
    color: "#6db0f5",
    map: Uranus,
    orbit: {
      siderealYears: 84.01,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 19.18916464,
          eccentricityRadians: 0.04725744,
          inclinationDegrees: 0.77263783,
          meanLongitudeDegrees: 313.23810451,
          periapsisLongitudeDegrees: 170.9542763,
          ascendingNodeLongitudeDegrees: 74.01692503,
        },
        rates: {
          semiMajorAxisAu: -0.00196176,
          eccentricityRadians: -0.00004397,
          inclinationDegrees: -0.00242939,
          meanLongitudeDegrees: 428.48202785,
          periapsisLongitudeDegrees: 0.40805281,
          ascendingNodeLongitudeDegrees: 0.04240589,
        },
      },
    },
  },
  {
    name: "neptune",
    radius: 24622,
    color: "#3059af",
    map: Neptune,
    orbit: {
      siderealYears: 164.8,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 30.06992276,
          eccentricityRadians: 0.00859048,
          inclinationDegrees: 1.77004347,
          meanLongitudeDegrees: -55.12002969,
          periapsisLongitudeDegrees: 44.96476227,
          ascendingNodeLongitudeDegrees: 131.78422574,
        },
        rates: {
          semiMajorAxisAu: 0.00026291,
          eccentricityRadians: 0.00005105,
          inclinationDegrees: 0.00035372,
          meanLongitudeDegrees: 218.45945325,
          periapsisLongitudeDegrees: -0.32241464,
          ascendingNodeLongitudeDegrees: -0.00508664,
        },
      },
    },
  },
  {
    name: "pluto",
    radius: 1187,
    color: "#dbe8f0",
    map: Pluto,
    orbit: {
      siderealYears: 248.1,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 39.48211675,
          eccentricityRadians: 0.2488273,
          inclinationDegrees: 17.14001206,
          meanLongitudeDegrees: 238.92903833,
          periapsisLongitudeDegrees: 224.06891629,
          ascendingNodeLongitudeDegrees: 110.30393684,
        },
        rates: {
          semiMajorAxisAu: -0.00031596,
          eccentricityRadians: 0.0000517,
          inclinationDegrees: 0.00004818,
          meanLongitudeDegrees: 145.20780515,
          periapsisLongitudeDegrees: -0.04062942,
          ascendingNodeLongitudeDegrees: -0.01183482,
        },
      },
    },
  },
] as SolarSystemObject[];
