const a = 6378137; // Semi-major axis of reference ellipsoid.
const f = 1 / 298.257223563; // Ellipsoidal flattening.

const oLat = 1.366666; // Origin latitude in degrees.
const oLon = 103.833333; // Origin longitude in degrees.
const oN = 38744.572; // False Northing.
const oE = 28001.642; // False Easting.
const k = 1; // Central meridian scale factor.
//	Returns a pair (lat, lon) representing Latitude and Longitude.

const b = a * (1 - f); //Semi-minor axis of reference ellipsoid.
const e2 = 2 * f - f * f; // Square of eccentricity of reference ellipsoid.
const e4 = e2 * e2;
const e6 = e4 * e2;
const A0 = 1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256;
const A2 = (3.0 / 8.0) * (e2 + e4 / 4 + (15 * e6) / 128);
const A4 = (15.0 / 256.0) * (e4 + (3 * e6) / 4);
const A6 = (35.0 * e6) / 3072.0;

const calcM = function (lat: number) {
  var latR = (lat * Math.PI) / 180;
  return (
    a *
    (A0 * latR -
      A2 * Math.sin(2 * latR) +
      A4 * Math.sin(4 * latR) -
      A6 * Math.sin(6 * latR))
  );
};

const calcRho = function (sin2Lat: number) {
  var num = a * (1 - e2);
  var denom = Math.pow(1 - e2 * sin2Lat, 3 / 2);
  return num / denom;
};

const calcV = function (sin2Lat: number) {
  var poly = 1 - e2 * sin2Lat;
  return a / Math.sqrt(poly);
};

const computeLatLon = (N: number, E: number) => {
  var Nprime = N - oN;
  var Mo = calcM(oLat);
  var Mprime = Mo + Nprime / k;
  var n = (a - b) / (a + b);
  var n2 = n * n;
  var n3 = n2 * n;
  var n4 = n2 * n2;
  var G =
    a *
    (1 - n) *
    (1 - n2) *
    (1 + (9 * n2) / 4 + (225 * n4) / 64) *
    (Math.PI / 180);
  var sigma = (Mprime * Math.PI) / (180 * G);

  var latPrimeT1 = ((3 * n) / 2 - (27 * n3) / 32) * Math.sin(2 * sigma);
  var latPrimeT2 = ((21 * n2) / 16 - (55 * n4) / 32) * Math.sin(4 * sigma);
  var latPrimeT3 = ((151 * n3) / 96) * Math.sin(6 * sigma);
  var latPrimeT4 = ((1097 * n4) / 512) * Math.sin(8 * sigma);
  var latPrime = sigma + latPrimeT1 + latPrimeT2 + latPrimeT3 + latPrimeT4;

  var sinLatPrime = Math.sin(latPrime);
  var sin2LatPrime = sinLatPrime * sinLatPrime;

  var rhoPrime = calcRho(sin2LatPrime);
  var vPrime = calcV(sin2LatPrime);
  var psiPrime = vPrime / rhoPrime;
  var psiPrime2 = psiPrime * psiPrime;
  var psiPrime3 = psiPrime2 * psiPrime;
  var psiPrime4 = psiPrime3 * psiPrime;
  var tPrime = Math.tan(latPrime);
  var tPrime2 = tPrime * tPrime;
  var tPrime4 = tPrime2 * tPrime2;
  var tPrime6 = tPrime4 * tPrime2;
  var Eprime = E - oE;
  var x = Eprime / (k * vPrime);
  var x2 = x * x;
  var x3 = x2 * x;
  var x5 = x3 * x2;
  var x7 = x5 * x2;

  // Compute Latitude
  var latFactor = tPrime / (k * rhoPrime);
  var latTerm1 = latFactor * ((Eprime * x) / 2);
  var latTerm2 =
    latFactor *
    ((Eprime * x3) / 24) *
    (-4 * psiPrime2 + 9 * psiPrime * (1 - tPrime2) + 12 * tPrime2);
  var latTerm3 =
    latFactor *
    ((Eprime * x5) / 720) *
    (8 * psiPrime4 * (11 - 24 * tPrime2) -
      12 * psiPrime3 * (21 - 71 * tPrime2) +
      15 * psiPrime2 * (15 - 98 * tPrime2 + 15 * tPrime4) +
      180 * psiPrime * (5 * tPrime2 - 3 * tPrime4) +
      360 * tPrime4);
  var latTerm4 =
    latFactor *
    ((Eprime * x7) / 40320) *
    (1385 - 3633 * tPrime2 + 4095 * tPrime4 + 1575 * tPrime6);
  var lat = latPrime - latTerm1 + latTerm2 - latTerm3 + latTerm4;

  // Compute Longitude
  var secLatPrime = 1 / Math.cos(lat);
  var lonTerm1 = x * secLatPrime;
  var lonTerm2 = ((x3 * secLatPrime) / 6) * (psiPrime + 2 * tPrime2);
  var lonTerm3 =
    ((x5 * secLatPrime) / 120) *
    (-4 * psiPrime3 * (1 - 6 * tPrime2) +
      psiPrime2 * (9 - 68 * tPrime2) +
      72 * psiPrime * tPrime2 +
      24 * tPrime4);
  var lonTerm4 =
    ((x7 * secLatPrime) / 5040) *
    (61 + 662 * tPrime2 + 1320 * tPrime4 + 720 * tPrime6);
  var lon = (oLon * Math.PI) / 180 + lonTerm1 - lonTerm2 + lonTerm3 - lonTerm4;

  return { lat: lat / (Math.PI / 180), lon: lon / (Math.PI / 180) };
};
