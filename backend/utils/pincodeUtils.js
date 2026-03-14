// backend/utils/pincodeUtils.js
// Uses local pincodeData.js — fully offline, covers all major Indian pincodes.
// Falls back to district/zone prefix match if exact pincode not in dataset.

const { getCoords, haversineDistance } = require("./pincodeData")

/**
 * Get coordinates for a pincode from local data.
 * Returns { lat, lng } or null.
 */
function getCoordinatesForPincode(pincode) {
  return getCoords(pincode)
}

module.exports = { getCoordinatesForPincode, haversineDistance }