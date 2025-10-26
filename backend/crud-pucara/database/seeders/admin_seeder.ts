// database/seeders/admin_seeder.ts
import User from '#models/user'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Obtener credenciales desde variables de entorno
    const adminEmail = env.get('ADMIN_EMAIL', 'admin@pucara.local')
    const adminName = env.get('ADMIN_NAME', 'Administrador')
    const adminPassword = env.get('ADMIN_PASSWORD', 'admin123')
    const adminUsername = env.get('ADMIN_USERNAME', 'admin')

    // Verificar si el usuario ya existe
    const existingUser = await User.findBy('email', adminEmail)

    if (existingUser) {
      console.log('ℹ️  Usuario Admin ya existe:', adminEmail)
      // Actualizar campos si no están configurados
      let updated = false
      if (!existingUser.role || existingUser.role !== 'admin') {
        existingUser.role = 'admin'
        updated = true
      }
      if (!existingUser.username || existingUser.username !== adminUsername) {
        existingUser.username = adminUsername
        updated = true
      }
      // Siempre actualizar la contraseña para mantenerla sincronizada con .env
      existingUser.password = adminPassword
      updated = true

      if (updated) {
        await existingUser.save()
        console.log('✅ Usuario Admin actualizado (role, username y password)')
      }
      return
    }

    // Crear el usuario admin
    await User.create({
      fullName: adminName,
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    })

    console.log('✅ Usuario Admin creado exitosamente')
    console.log('📧 Email:', adminEmail)
    console.log('👤 Username:', adminUsername)
    console.log('🔑 Role: admin')
    console.log('⚠️  Recuerda cambiar la contraseña en producción!')
  }
}
