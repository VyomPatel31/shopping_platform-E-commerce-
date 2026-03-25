import { Router } from "express"
import { createOrderController } from "../controllers/payment.controller.js"

const router = Router()

router.post("/create-order", createOrderController)

export default router
