const Patient = require("../models/Patient")

exports.getPatientsByUpload = async (req, res) => {

  try {

    const uploadId = req.params.uploadId

    const patients = await Patient.find({ uploadId })
      .sort({ createdAt: -1 })

    res.json(patients)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}