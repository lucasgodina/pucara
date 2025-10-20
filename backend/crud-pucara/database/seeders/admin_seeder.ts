// database/seeders/admin_seeder.ts

import User from '#models/user'

export default class AdminSeeder {
  public async run() {
    // Verificar si el usuario admin ya existe
    const existingUser = await User.findBy('email', 'psammartino@pucaragaming.com.ar')

    if (existingUser) {
      console.log('ℹ️  Usuario Admin ya existe')
      return
    }

    await User.create({
      fullName: 'Administrador',
      email: 'psammartino@pucaragaming.com.ar',
      password: 'admin123',
    })

    console.log('✅ Usuario Admin creado exitosamente')
  }
}
