import cloudinary from '#config/cloudinary'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { Exception } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'

// Define the return structure for the method uploadImage
interface UploadResult {
  url: string
  publicId: string
}

export class CloudinaryProvider {
  // Validation constants (same as LocalStorageProvider)
  private readonly ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
  private readonly MAX_SIZE = 10 * 1024 * 1024 // 10 MB

  /**
   * Validate and upload the image to Cloudinary
   * @param file - The uploaded file to be processed (MultipartFile)
   * @param folder - The target folder within Cloudinary storage
   * @return An object containing the URL and publicId of the stored image
   */
  public async uploadImage(file: MultipartFile, folder: string): Promise<UploadResult> {
    // Validate file extension
    const extension = file.extname?.toLowerCase() || ''
    if (!extension || !this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new Exception(
        `Extensión de archivo no permitida. Solo se permiten: ${this.ALLOWED_EXTENSIONS.join(
          ', '
        )}.`,
        { status: 415 }
      )
    }

    // Validate file size
    if (file.size > this.MAX_SIZE) {
      throw new Exception(
        `El archivo excede el tamaño máximo permitido (${this.MAX_SIZE / (1024 * 1024)}MB).`,
        { status: 413 }
      )
    }

    try {
      // Generate unique public_id
      const uniqueId = cuid()

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.tmpPath!, {
        folder: `pucara/${folder}`,
        public_id: uniqueId,
        // Transformaciones simples para MVP (no consumen cuota extra)
        // Solo aplicamos límite de ancho para optimizar tamaño
        transformation: [
          {
            width: 1920,
            crop: 'limit', // No recorta, solo limita el tamaño máximo
          },
        ],
      })

      return {
        url: result.secure_url,
        publicId: result.public_id,
      }
    } catch (error) {
      throw new Exception('Error al subir la imagen a Cloudinary.', { status: 500, cause: error })
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param imageUrl - The URL of the image to be deleted
   * @param publicId - Optional: The publicId of the image (for faster deletion)
   */
  public async deleteImage(imageUrl: string, publicId?: string): Promise<void> {
    try {
      let idToDelete = publicId

      // If publicId is not provided, extract it from the URL
      if (!idToDelete) {
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{extension}
        // We need to extract the public_id from the URL
        const match = imageUrl.match(/\/v\d+\/(.+)\.\w+$/)
        if (match) {
          idToDelete = match[1]
        }
      }

      if (!idToDelete) {
        console.warn(`[Cloudinary] No se pudo extraer el publicId de la URL: ${imageUrl}`)
        return
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(idToDelete)
    } catch (error) {
      // Silent catch - no lanzar error si la imagen no existe
      console.warn(`[Cloudinary] Error al eliminar imagen: ${imageUrl}`, error)
    }
  }

  /**
   * Get a transformed URL for an existing Cloudinary image
   * @param url - The original Cloudinary URL
   * @param options - Transformation options (width, height, crop)
   * @return The transformed URL
   */
  public getTransformedUrl(
    url: string,
    options: { width?: number; height?: number; crop?: string } = {}
  ): string {
    // Check if it's a valid Cloudinary URL
    if (!url.includes('res.cloudinary.com')) {
      return url // Return original URL if not from Cloudinary
    }

    // Build transformation string
    const transformations: string[] = []

    if (options.width) transformations.push(`w_${options.width}`)
    if (options.height) transformations.push(`h_${options.height}`)
    if (options.crop) transformations.push(`c_${options.crop}`)

    if (transformations.length === 0) {
      return url // No transformations needed
    }

    // Insert transformations into URL
    // Format: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/v{version}/...
    const transformStr = transformations.join(',')
    return url.replace(/\/upload\//, `/upload/${transformStr}/`)
  }
}
