export const getDashboardController = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()

    res.status(200).json(
      buildResponse(200, {
        totalUsers,
        totalOrders,
        totalProducts,
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}