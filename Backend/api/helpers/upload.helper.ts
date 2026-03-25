import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const random = Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase()
    cb(null, `product-${baseName}-${timestamp}-${random}${ext}`)
  },
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, webp, gif)'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

export default upload
