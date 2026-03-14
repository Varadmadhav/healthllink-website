// backend/utils/pincodeUtils.js
// Uses OpenStreetMap Nominatim — free, no API key, accurate for Indian pincodes.
// Results cached in MongoDB so each pincode is only ever fetched once.

const https = require("https")
const PincodeCache = require("../models/PincodeCache")

// In-memory cache — avoids DB round-trip for pincodes already seen this session
const memoryCache = {}

/**
 * Get lat/lng for an Indian pincode.
 * Order: memory cache → MongoDB cache → Nominatim API (once per pincode ever)
 * Returns { lat, lng } or null.
 */
async function getCoordinatesForPincode(pincode) {
  const pin = String(pincode).trim()

  // 1. Memory cache
  if (memoryCache[pin]) return memoryCache[pin]

  // 2. MongoDB cache
  try {
    const cached = await PincodeCache.findOne({ pincode: pin })
    if (cached) {
      const coords = { lat: cached.lat, lng: cached.lng }
      memoryCache[pin] = coords
      return coords
    }
  } catch (e) {
    console.error("PincodeCache DB lookup error:", e.message)
  }

  // 3. Nominatim API call
  const coords = await fetchFromNominatim(pin)

  if (coords) {
    // Persist to MongoDB — never call API for this pincode again
    try {
      await PincodeCache.create({ pincode: pin, lat: coords.lat, lng: coords.lng })
    } catch (e) {
      // Ignore duplicate key on race condition
      if (e.code !== 11000) console.error("PincodeCache save error:", e.message)
    }
    memoryCache[pin] = coords
  }

  return coords
}

/**
 * Call OpenStreetMap Nominatim to geocode an Indian pincode.
 * Returns { lat, lng } or null.
 */
function fetchFromNominatim(pincode) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(`${pincode}, India`)
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=in`

    const options = {
      headers: {
        // Nominatim requires a User-Agent identifying your application
        "User-Agent": "HealthLinkAdmin/1.0 (healthlink-admin@app.com)"
      }
    }

    https.get(url, options, (res) => {
      let raw = ""
      res.on("data", (chunk) => { raw += chunk })
      res.on("end", () => {
        try {
          const data = JSON.parse(raw)
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat)
            const lng = parseFloat(data[0].lon)
            if (!isNaN(lat) && !isNaN(lng)) {
              return resolve({ lat, lng })
            }
          }
          resolve(null)
        } catch (e) {
          resolve(null)
        }
      })
    }).on("error", (e) => {
      console.error("Nominatim request error:", e.message)
      resolve(null)
    })
  })
}

/**
 * Haversine formula — straight-line distance in km.
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRad(deg) { return deg * (Math.PI / 180) }

module.exports = { getCoordinatesForPincode, haversineDistance }