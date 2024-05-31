const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const convertObjectId = (id) => new Types.ObjectId(id);

const getSelectData = (select = []) =>
  Object.fromEntries(select.map((s) => [s, 1]));

const getUnSelectData = (select = []) =>
  Object.fromEntries(select.map((s) => [s, 0]));

/**
 * @param {number[]} place1
 * @param {number[]} place2
 * @returns {number}
 */
const getDistanceFromLatLong = (place1, place2) => {
  if (!Array.isArray(place1) || !Array.isArray(place2)) {
    throw new Error("Error");
  }
  const [long1, lat1] = place1;
  const [long2, lat2] = place2;
  // radius from the earth to KM
  const R = 6371;
  const dLat = degToRad(lat2 - lat1);
  const dLong = degToRad(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

/**
 * @param {number} deg
 * @returns {number}
 */
const degToRad = (deg) => {
  return deg * (Math.PI / 180);
};

module.exports = {
  getInfoData,
  convertObjectId,
  getUnSelectData,
  getSelectData,
  getDistanceFromLatLong,
};
