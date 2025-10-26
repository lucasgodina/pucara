import env from '#start/env'
import { v2 as cloudinary } from 'cloudinary'

// Solo configurar Cloudinary si el proveedor es 'cloudinary'
if (env.get('STORAGE_PROVIDER') === 'cloudinary') {
  cloudinary.config({
    cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
    api_key: env.get('CLOUDINARY_API_KEY'),
    api_secret: env.get('CLOUDINARY_API_SECRET'),
    secure: true,
  })
}

export default cloudinary
