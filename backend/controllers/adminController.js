const Company = require("../models/Company")
const Center = require("../models/Center")

// Add Company
exports.addCompany = async (req, res) => {
  try {

    const company = new Company(req.body)

    await company.save()

    res.status(201).json(company)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Companies
exports.getCompanies = async (req, res) => {
  try {

    const companies = await Company.find()

    res.json(companies)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add Center
exports.addCenter = async (req, res) => {
  try {

    const center = new Center(req.body)

    await center.save()

    res.status(201).json(center)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Centers
exports.getCenters = async (req, res) => {
  try {

    const centers = await Center.find()

    res.json(centers)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}