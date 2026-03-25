// controllers/address.controller.js
import httpStatus from 'http-status'
import Address from '../models/address.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const addAddressController = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user._id,
    })

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, address)
    )
  } catch (err) {
    handleError(res, err)
  }
}

export const getAddressController = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })

    res.status(200).json(buildResponse(200, addresses))
  } catch (err) {
    handleError(res, err)
  }
}