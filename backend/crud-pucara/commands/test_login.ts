import User from '#models/user'
import { BaseCommand } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class TestLogin extends BaseCommand {
  static commandName = 'test:login'
  static description = 'Test login credentials'

  static options: CommandOptions = {}

  async run() {
    const testCredentials = [
      { identifier: 'lucasgodina', password: 'pucara2025' },
      { identifier: 'lucasgodina@gmail.com', password: 'pucara2025' },
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
    const user = await User.findByOrFail('email', 'lucasgodina@gmail.com')
    this.logger.info(`Email: ${user.email}`)
    this.logger.info(`Username: ${user.username}`)
    this.logger.info(`Password hash (primeros 50 chars): ${user.password.substring(0, 50)}`)

    // Intentar hashear la contraseña y compararla
    const testPassword = 'pucara2025'
    const isValid = await hash.use('scrypt').verify(user.password, testPassword)
    this.logger.info(`\n¿La contraseña "${testPassword}" coincide? ${isValid ? '✅ Sí' : '❌ No'}`)
  }
}
