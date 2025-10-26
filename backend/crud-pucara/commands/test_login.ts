import User from '#models/user'
import env from '#start/env'
import { BaseCommand } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestLogin extends BaseCommand {
  static commandName = 'test:login'
  static description = 'Test login credentials from .env'

  static options: CommandOptions = {}

  async run() {
    const adminEmail = env.get('ADMIN_EMAIL')
    const adminPassword = env.get('ADMIN_PASSWORD')
    const adminUsername = env.get('ADMIN_USERNAME')

    if (!adminEmail || !adminPassword || !adminUsername) {
      this.logger.error('❌ Credenciales no configuradas en .env')
      this.logger.error('Por favor configura: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME')
      return
    }

    const testCredentials = [
      { identifier: adminUsername, password: adminPassword },
      { identifier: adminEmail, password: adminPassword },
    ]

    for (const cred of testCredentials) {
      try {
        this.logger.info(`\n🔍 Probando login con: ${cred.identifier}`)
        const user = await User.verifyCredentials(cred.identifier, cred.password)
        this.logger.success('✅ Login exitoso!')
        this.logger.info(`Usuario: ${user.id} - ${user.username} - ${user.email} - ${user.role}`)
      } catch (error: any) {
        this.logger.error(`❌ Error: ${error.message}`)
      }
    }

    // Verificar manualmente el hash
    this.logger.info('\n🔐 Verificación manual del hash:')
    const user = await User.findByOrFail('email', adminEmail)
    this.logger.info(`Email: ${user.email}`)
    this.logger.info(`Username: ${user.username}`)

    const isValid = await hash.use('scrypt').verify(user.password, adminPassword)
    this.logger.info(`\n¿La contraseña coincide? ${isValid ? '✅ Sí' : '❌ No'}`)
  }
}
