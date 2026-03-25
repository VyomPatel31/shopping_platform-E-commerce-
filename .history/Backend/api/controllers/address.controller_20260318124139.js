import httpStatus from 'http-status'
import Address from '../models/address.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// add address 
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

// get address
export const getAddressController = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })

    res.status(200).json(buildResponse(200, addresses))
  } catch (err) {
    handleError(res, err)
  }
}

// update address
export const updateAddressController = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json(buildResponse(200, address))
  } catch (err) {
    handleError(res, err)
  }
}

// delete address
export const deleteAddressController = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id)

    res.status(200).json(buildResponse(200, { message: "Deleted" }))
  } catch (err) {
    handleError(res, err)
  }
}