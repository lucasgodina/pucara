import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { inject } from '@adonisjs/core/container'
import { Exception } from '@adonisjs/core/exceptions'
import { ApplicationService } from '@adonisjs/core/types'

// Import providers
import { LocalStorageProvider } from 'app/providers/local_storage_provider.js'
// import { CloudinaryStorageProvider } from 'app/providers/cloudinary_storage_provider.js'
// import { S3StorageProvider } from 'app/providers/s3_storage_provider.js'

// Result interface for upload operations
interface UploadResult {
  url: string
  path?: string
  name: string
}

// Duck typing for storage providers
type AnyStorageProvider = LocalStorageProvider /* | CloudinaryStorageProvider | S3StorageProvider */

/**
 * Centralized service for image storage management.
 */
@inject()
export class ImageStorageService {
  private provider: AnyStorageProvider

  constructor(application: ApplicationService) {
    const providerKey = this.getProviderName()

    console.log(`[ImageStorageService] Active provider: ${providerKey}`)

    // Factory Pattern
    switch (providerKey) {
      case 'local':
        this.provider = new LocalStorageProvider(application)
        break

      case 'cloudinary':
        // this.provider = new CloudinaryStorageProvider()
        throw new Exception('Cloudinary provider not implemented yet', { status: 501 })

      case 's3':
        // this.provider = new S3StorageProvider()
        throw new Exception('S3 provider not implemented yet', { status: 501 })

      default:
        throw new Exception(`Unsupported storage provider: ${providerKey}`, { status: 500 })
    }
  }

  // Returns the name of the provider from settings
  public getProviderName(): string {
    return env.get('STORAGE_PROVIDER')
  }

  // Uploads an image using the selected provider
  public uploadImage(file: MultipartFile, folder: string): Promise<UploadResult> {
    return this.provider.uploadImage(file, folder)
  }

  // Deletes an image from the selected provider
  public deleteImage(imageUrl: string, publicId?: string): Promise<void> {
    return this.provider.deleteImage(imageUrl, publicId)
  }
}

// Export a singleton instance for convenience when DI is not used
import app from '@adonisjs/core/services/app'
export default new ImageStorageService(app)
