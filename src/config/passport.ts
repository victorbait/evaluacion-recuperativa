import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

export const configurePassport = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
      
      let user = await db.get('SELECT * FROM users WHERE google_id = ?', profile.id);
      
      if (!user) {
        user = await db.get('SELECT * FROM users WHERE email = ?', profile.emails?.[0]?.value);
        
        if (user) {
          await db.run('UPDATE users SET google_id = ? WHERE id = ?', profile.id, user.id);
        } else {
          const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
          const result = await db.run(
            'INSERT INTO users (username, email, password_hash, google_id, display_name) VALUES (?, ?, ?, ?, ?)',
            profile.emails?.[0]?.value || `user_${profile.id}`,
            profile.emails?.[0]?.value,
            hashedPassword,
            profile.id,
            profile.displayName
          );
          
          user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);
        }
      }
      
      await db.close();
      
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      console.error('Error en autenticación Google:', error);
      return done(error, false);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
      const user = await db.get('SELECT * FROM users WHERE id = ?', id);
      await db.close();
      done(null, user);
    } catch (error) {
      done(error, undefined);
    }
  });
}; 