import express from 'express';
import { indexContacts } from '../controllers/ContactsController';
import { 
  renderAdminLogin, 
  handleAdminLogin, 
  renderAdminDashboard,
  renderAdminPayments,
  handleAdminLogout,
  requireAdminAuth,
  checkSessionActivity 
} from '../controllers/AdminController';

const router = express.Router();

router.get('/', (req, res) => {
  if ((req.session as any)?.isAdmin) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/login', renderAdminLogin);
router.post('/login', handleAdminLogin);
router.get('/logout', handleAdminLogout);

router.get('/dashboard', checkSessionActivity, requireAdminAuth, renderAdminDashboard);
router.get('/contacts', checkSessionActivity, requireAdminAuth, indexContacts);
router.get('/payments', checkSessionActivity, requireAdminAuth, renderAdminPayments);

export default router; 