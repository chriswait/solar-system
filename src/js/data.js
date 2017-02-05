var SolarSystemData = [
  {
    name: "sun",
    radius: 695700,
    color: 'yellow',
    star: {
    }
  },
  {
    name: 'mercury',
    radius: 10,
    color: 0xffffff,
    orbit: {
      radius: 200,
      keplerianElements: {
        initial: {
          semiMajorAxisAu: 0.38709927,
          eccentricityRadians: 0.20563593,
          inclinationDegrees: 7.00497902,
          meanLongitudeDegrees: 252.25032350,
          perihelionLongitudeDegrees: 77.45779628,
          ascendingNodeLongitudeDegrees: 48.33076593
        },
        rates: {
            semiMajorAxisAu: 0.00000037,
            eccentricityRadians: 0.00001906,
            inclinationDegrees: -0.00594749,
            meanLongitudeDegrees: 149472.67411175,
            perihelionLongitudeDegrees: 0.16047689,
            ascendingNodeLongitudeDegrees: -0.12534081
        }
      }
    }
  },
  {
    name: 'venus',
    radius: 10,
    color: 0xffffff,
    orbit: {
      radius: 300,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 0.72333566,
            eccentricityRadians: 0.00677672,
            inclinationDegrees: 3.39467605,
            meanLongitudeDegrees: 181.97909950,
            perihelionLongitudeDegrees: 131.60246718,
            ascendingNodeLongitudeDegrees: 76.67984255
        },
        rates: {
            semiMajorAxisAu: 0.00000390,
            eccentricityRadians: -0.00004107,
            inclinationDegrees: -0.00078890,
            meanLongitudeDegrees: 58517.81538729,
            perihelionLongitudeDegrees: 0.00268329,
            ascendingNodeLongitudeDegrees: -0.27769418
        }
      }
    }
  },
  {
    name: 'earth',
    radius: 6371,
    color: 'green',
    orbit: {
      radius: 149600000,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 1.00000261,
            eccentricityRadians: 0.01671123,
            inclinationDegrees: -0.00001531,
            meanLongitudeDegrees: 100.46457166,
            perihelionLongitudeDegrees: 102.93768193,
            ascendingNodeLongitudeDegrees: 0.0
        },
        rates: {
            semiMajorAxisAu: 0.00000562,
            eccentricityRadians: -0.00004392,
            inclinationDegrees: -0.01294668,
            meanLongitudeDegrees: 35999.37244981,
            perihelionLongitudeDegrees: 0.32327364,
            ascendingNodeLongitudeDegrees: 0.0
        }
      }
    }
  },
  {
    name: 'mars',
    radius: 10,
    color: 0xffffff,
    orbit: {
      radius: 500,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 1.52371034,
            eccentricityRadians: 0.09339410,
            inclinationDegrees: 1.84969142,
            meanLongitudeDegrees: -4.55343205,
            perihelionLongitudeDegrees: -23.94362959,
            ascendingNodeLongitudeDegrees: 49.55953891
        },
        rates: {
            semiMajorAxisAu: 0.00001847,
            eccentricityRadians: 0.00007882,
            inclinationDegrees: -0.00813131,
            meanLongitudeDegrees: 19140.30268499,
            perihelionLongitudeDegrees: 0.44441088,
            ascendingNodeLongitudeDegrees: -0.29257343
        }
      }
    }
  },
  {
    name: 'jupiter',
    radius: 10,
    color: 0xffffff,
    orbit: {
      radius: 600,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 5.20288700,
            eccentricityRadians: 0.04838624,
            inclinationDegrees: 1.30439695,
            meanLongitudeDegrees: 34.39644051,
            perihelionLongitudeDegrees: 14.72847983,
            ascendingNodeLongitudeDegrees: 100.47390909
        },
        rates: {
            semiMajorAxisAu: -0.00011607,
            eccentricityRadians: -0.00013253,
            inclinationDegrees: -0.00183714,
            meanLongitudeDegrees: 3034.74612775,
            perihelionLongitudeDegrees: 0.21252668,
            ascendingNodeLongitudeDegrees: 0.20469106
        }
      }
    }
  },
  {
    name: 'saturn',
    radius: 10,
    color: 0xffffff,
    orbit: {
      radius: 700,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 9.53667594,
            eccentricityRadians: 0.05386179,
            inclinationDegrees: 2.48599187,
            meanLongitudeDegrees: 49.95424423,
            perihelionLongitudeDegrees: 92.59887831,
            ascendingNodeLongitudeDegrees: 113.66242448
        },
        rates: {
            semiMajorAxisAu: -0.00125060,
            eccentricityRadians: -0.00050991,
            inclinationDegrees: 0.00193609,
            meanLongitudeDegrees: 1222.49362201,
            perihelionLongitudeDegrees: -0.41897216,
            ascendingNodeLongitudeDegrees: -0.28867794
        }
      }
    }
  },
  {
    name: 'uranus',
    radius: 10,
    color: 0xffffff,
    orbit: {
      radius: 800,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 19.18916464,
            eccentricityRadians: 0.04725744,
            inclinationDegrees: 0.77263783,
            meanLongitudeDegrees: 313.23810451,
            perihelionLongitudeDegrees: 170.95427630,
            ascendingNodeLongitudeDegrees: 74.01692503
        },
        rates: {
            semiMajorAxisAu: -0.00196176,
            eccentricityRadians: -0.00004397,
            inclinationDegrees: -0.00242939,
            meanLongitudeDegrees: 428.48202785,
            perihelionLongitudeDegrees: 0.40805281,
            ascendingNodeLongitudeDegrees: 0.04240589
        }
      }
    }
  },
  {
    name: 'neptune',
    radius: 10,
    color: 0xffffff,
    orbit: {
      radius: 900,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 30.06992276,
            eccentricityRadians: 0.00859048,
            inclinationDegrees: 1.77004347,
            meanLongitudeDegrees: -55.12002969,
            perihelionLongitudeDegrees: 44.96476227,
            ascendingNodeLongitudeDegrees: 131.78422574
        },
        rates: {
            semiMajorAxisAu: 0.00026291,
            eccentricityRadians: 0.00005105,
            inclinationDegrees: 0.00035372,
            meanLongitudeDegrees: 218.45945325,
            perihelionLongitudeDegrees: -0.32241464,
            ascendingNodeLongitudeDegrees: -0.00508664
        }
      }
    }
  },
  {
    name: 'pluto',
    radius: 1187,
    color: 'red',
    orbit: {
      radius: 5906292480,
      keplerianElements: {
        initial: {
            semiMajorAxisAu: 39.48211675,
            eccentricityRadians: 0.24882730,
            inclinationDegrees: 17.14001206,
            meanLongitudeDegrees: 238.92903833,
            perihelionLongitudeDegrees: 224.06891629,
            ascendingNodeLongitudeDegrees: 110.30393684
        },
        rates: {
            semiMajorAxisAu: -0.00031596,
            eccentricityRadians: 0.00005170,
            inclinationDegrees: 0.00004818,
            meanLongitudeDegrees: 145.20780515,
            perihelionLongitudeDegrees: -0.04062942,
            ascendingNodeLongitudeDegrees: -0.01183482
        }
      }
    }
  }
];
export {SolarSystemData};
