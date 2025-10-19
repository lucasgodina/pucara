import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const UserController = () => import('#controllers/user_controller')
const NewsController = () => import('#controllers/news_controller')

// Rutas públicas
router.post('/login', [AuthController, 'login'])

router.get('/', async () => {
  return { hello: 'world' }
})

// 🛡 Ruta solo para admins
router
  .get('/admin-only', async ({ auth }) => {
    return {
      message: `Bienvenido administrador ${auth.user?.email}`,
    }
  })
  .middleware([
    middleware.auth(), // auth sin parámetros
    middleware.role(['admin']), // role con parámetro admin
  ])

// 🔐 Rutas de autenticación
router
  .post('/register', [AuthController, 'register'])
  .middleware([middleware.auth(), middleware.role(['admin'])])

router.get('/profile', [AuthController, 'profile']).middleware([middleware.auth()])

router.post('/logout', [AuthController, 'logout']).middleware([middleware.auth()])

// 👥 Rutas de usuarios (solo admin)
router
  .group(() => {
    router.get('/', [UserController, 'index'])
    router.post('/', [UserController, 'store'])
    router.get('/:id', [UserController, 'show'])
    router.put('/:id', [UserController, 'update'])
    router.delete('/:id', [UserController, 'destroy'])
    router.patch('/:id/role', [UserController, 'changeRole'])
  })
  .prefix('/users')
  .middleware([middleware.auth(), middleware.role(['admin'])])

// 📰 Rutas de noticias
router
  .group(() => {
    router.get('/', [NewsController, 'index']) // Todos pueden ver
    router.post('/', [NewsController, 'store']) // Solo admin y editor
    router.get('/:id', [NewsController, 'show']) // Todos pueden ver
    router.put('/:id', [NewsController, 'update']) // Solo admin y editor (con restricciones)
    router.delete('/:id', [NewsController, 'destroy']) // Solo admin y editor (con restricciones)
    router.get('/my/news', [NewsController, 'myNews']) // Solo admin y editor
    router.get('/user/:userId/news', [NewsController, 'newsByUser']) // Solo admin
  })
  .prefix('/news')
  .middleware([middleware.auth()])
