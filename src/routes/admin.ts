import express from 'express';
import { indexContacts } from '../controllers/ContactsController';
import { 
  renderAdminLogin, 
  handleAdminLogin, 
  renderAdminDashboard,
  renderAdminPayments,
  handleAdminLogout,
  requireAdminAuth 
} from '../controllers/AdminController';

const router = express.Router();

// Redirección para la raíz de /admin
router.get('/', (req, res) => {
  if ((req.session as any)?.isAdmin) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login');
  }
});

// Rutas de autenticación
router.get('/login', renderAdminLogin);
router.post('/login', handleAdminLogin);
router.get('/logout', handleAdminLogout);

// Rutas protegidas
router.get('/dashboard', requireAdminAuth, renderAdminDashboard);
router.get('/contacts', requireAdminAuth, indexContacts); // Ruta de contactos ahora protegida
router.get('/payments', requireAdminAuth, renderAdminPayments);

export default router;