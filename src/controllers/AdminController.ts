import { Request, Response, NextFunction } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@peluqueria.com';
const ADMIN_PASSWORD = 'admin123';

export const renderAdminLogin = (req: Request, res: Response) => {
  const error = req.query.error as string;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  res.render('admin/login', { error, googleClientId });
};

export const handleAdminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  const user = await db.get('SELECT * FROM users WHERE username = ?', username);
  await db.close();

  if (user && await bcrypt.compare(password, user.password_hash)) {
    (req.session as any).isAdmin = true;
    (req.session as any).adminUsername = user.username;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login?error=Credenciales inválidas');
  }
};

export const renderAdminDashboard = (req: Request, res: Response) => {
  if (!(req.session as any)?.isAdmin) {
    return res.redirect('/admin/login');
  }

  res.render('admin/dashboard', { 
    adminUsername: (req.session as any).adminUsername 
  });
};

export const renderAdminPayments = async (req: Request, res: Response) => {
  try {
    const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
    const payments = await db.all('SELECT * FROM payments ORDER BY created_at DESC');
    await db.close();
    res.render('admin/payments', { payments });
  } catch (error) {
    console.error('💥 ERROR al obtener los pagos:', error);
    res.status(500).send("Error al cargar la página de pagos.");
  }
};

export const handleAdminLogout = (req: Request, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.redirect('/admin/dashboard');
    }
    res.redirect('/admin/login');
  });
};

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any)?.isAdmin) {
    if (req.session.cookie && req.session.cookie.expires) {
      const now = new Date();
      const expires = new Date(req.session.cookie.expires);
      
      if (now > expires) {
        req.session.destroy(() => {
          res.redirect('/admin/login?error=Sesión expirada. Por favor, inicia sesión nuevamente.');
        });
        return;
      }
    }
    
    next();
  } else {
    res.redirect('/admin/login');
  }
};

export const checkSessionActivity = (req: Request, res: Response, next: NextFunction) => {
  if ((req.session as any)?.isAdmin) {
    (req.session as any).lastActivity = Date.now();
  }
  next();
}; 