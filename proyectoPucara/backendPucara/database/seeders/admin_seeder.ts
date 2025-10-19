// database/seeders/admin_seeder.ts

import User from '#models/user'

export default class AdminSeeder {
  public async run() {
    await User.create({
      username: 'admin',
      email: 'psammartino@pucaragaming.com.ar',
      password: 'admin123',
      role: 'admin',
    })

    console.log('✅ Usuario Admin creado exitosamente')
  }
}
