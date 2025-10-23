// database/seeders/admin_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    // Obtener credenciales desde variables de entorno
    const adminEmail = env.get('ADMIN_EMAIL', 'admin@pucara.local')
    const adminName = env.get('ADMIN_NAME', 'Administrador')
    const adminPassword = env.get('ADMIN_PASSWORD', 'admin123')

    // Verificar si el usuario ya existe
    const existingUser = await User.findBy('email', adminEmail)

    if (existingUser) {
      console.log('ℹ️  Usuario Admin ya existe:', adminEmail)
      return
    }

    // Crear el usuario admin
    await User.create({
      fullName: adminName,
      email: adminEmail,
      password: adminPassword,
    })

    console.log('✅ Usuario Admin creado exitosamente')
    console.log('📧 Email:', adminEmail)
    console.log('⚠️  Recuerda cambiar la contraseña en producción!')
  }
}