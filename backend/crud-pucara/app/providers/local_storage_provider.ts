import { MultipartFile } from '@adonisjs/core/bodyparser'
import { Exception } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'
import { ApplicationService } from '@adonisjs/core/types'
import fs from 'node:fs/promises'
import path from 'node:path'

// Define the return structure for the method uploadImage
interface UploadResult {
  url: string
  path: string
  name: string
}

export class LocalStorageProvider {
  // Validation constants
  private readonly ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
  private readonly MAX_SIZE = 10 * 1024 * 1024 // 10 MB

  constructor(protected app: ApplicationService) {}

  // Get the absolute path to the storage directory
  private getStoragePath() {
    return this.app.publicPath('uploads')
  }

  /**
   * Validate and move the uploaded image to the storage directory
   * @param file - The uploaded file to be processed (MultipartFile)
   * @param folder - The target folder within the storage directory
   * @return An object containing the URL and absolute path of the stored image
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

    // Generate unique file name and define paths
    const fileName = `${cuid()}.${extension}`
    const targetDir = path.join(this.getStoragePath(), folder)
    const filePath = path.join(targetDir, fileName)

    // Ensure the target directory exists
    await fs.mkdir(targetDir, { recursive: true })

    // Move the file to the target directory
    try {
      await file.move(filePath, { overwrite: true })

      if (file.hasErrors) {
        throw new Exception('Error al procesar el archivo', {
          status: 500,
          cause: file.errors,
        })
      }
    } catch (error) {
      throw new Exception('Error al mover el archivo subido.', { status: 500, cause: error })
    }

    // Return object with URL and path
    const relativeUrl = `/uploads/${folder}/${fileName}`

    return {
      url: relativeUrl,
      path: filePath,
      name: fileName,
    }
  }

  /**
   * Delete an image from the storage directory
   * @param imageUrl - The URL of the image to be deleted
   */
  public async deleteImage(imageUrl: string, _publicId?: string): Promise<void> {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return // Ignore invalid URLs
    }

    // Extract the path from the URL
    const relativePath = imageUrl.replace(/^\/uploads\//, '')
    const absolutePath = path.join(this.getStoragePath(), relativePath)

    // Delete file with silent catch
    try {
      await fs.unlink(absolutePath)
    } catch (error: any) {
      // Silent catch for ENOENT (file not found) errors
      if (error.code === 'ENOENT') {
        // ENOENT means "Error NO ENTry" (file does not exist)
        console.warn(`[LocalStorage] Intento de eliminar archivo no existente: ${absolutePath}`)
        return
      }
      // Rethrow other errors
      throw new Exception(`Error al eliminar el archivo: ${absolutePath}`, {
        status: 500,
        cause: error,
      })
    }
  }
}
