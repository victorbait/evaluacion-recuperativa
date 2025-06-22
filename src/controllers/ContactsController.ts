import { Request, Response } from 'express';
import ContactsModel from '../models/ContactsModel';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface GeoData {
    country_name?: string;
}

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';

if (!RECAPTCHA_SECRET_KEY || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error('faltan variables d entorno: RECAPTCHA_SECRET_KEY, EMAIL_USER o EMAIL_PASS');
}

export const addContact = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Datos recibidos en req.body:", req.body);

        const { email, name, message, country, 'g-recaptcha-response': captcha } = req.body;
        const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '0.0.0.0';
        const created_at = new Date().toISOString();

        if (!email || !name || !message) {
            res.render('contact', { 
                meta: { title: 'Contacto | Peluquería a Domicilio', description: 'Ponte en contacto con nosotros para agendar una cita o resolver tus dudas. Estamos para ayudarte.' },
                success: false, 
                message: "Todos los campos son obligatorios.",
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
            return;
        }

        if (!captcha) {
            res.render('contact', { 
                meta: { title: 'Contacto | Peluquería a Domicilio', description: 'Ponte en contacto con nosotros para agendar una cita o resolver tus dudas. Estamos para ayudarte.' },
                success: false, 
                message: "Por favor completa el recAPTCHA.",
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
            return;
        }

        try {
            const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`;
            const captchaResponse = await fetch(captchaVerifyURL, { method: 'POST' });
            const captchaData = await captchaResponse.json() as { success: boolean; score?: number };

            console.log("Respuesta de reCAPTCHA:", captchaData);

            if (!captchaData.success || (captchaData.score !== undefined && captchaData.score < 0.5)) {
                res.render('contact', { 
                    meta: { title: 'Contacto | Peluquería a Domicilio', description: 'Ponte en contacto con nosotros para agendar una cita o resolver tus dudas. Estamos para ayudarte.' },
                    success: false, 
                    message: "La verificación de reCAPTCHA ha fallado.",
                    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
                });
                return;
            }
        } catch (captchaError) {
            console.error("Error validando reCAPTCHA:", captchaError);
            res.render('contact', { 
                meta: { title: 'Contacto | Peluquería a Domicilio', description: 'Ponte en contacto con nosotros para agendar una cita o resolver tus dudas. Estamos para ayudarte.' },
                success: false, 
                message: "Error al verificar el captcha.",
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
            return;
        }

        let detectedCountry = country || "Desconocido";

        if (detectedCountry === "Desconocido") {
            try {
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                const data = await response.json() as GeoData;
                console.log("Datos de geolocalización:", data);
                detectedCountry = data.country_name || "Desconocido";
            } catch (geoError) {
                console.error("Error obteniendo geolocalización:", geoError);
            }
        }

        await ContactsModel.add({ email, name, comment: message, ip, created_at, country: detectedCountry });
        await sendEmail(name, email, message, ip, detectedCountry, created_at);
        
        res.render('contact', { 
            meta: { title: 'Contacto | Peluquería a Domicilio', description: 'Ponte en contacto con nosotros para agendar una cita o resolver tus dudas. Estamos para ayudarte.' },
            success: true, 
            message: "Contacto guardado exitosamente.",
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });

    } catch (error) {
        console.error("Error en addContact:", error);
        res.render('contact', { 
            meta: { title: 'Contacto | Peluquería a Domicilio', description: 'Ponte en contacto con nosotros para agendar una cita o resolver tus dudas. Estamos para ayudarte.' },
            success: false, 
            message: "Error al agregar contacto",
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
    }
};

export const getContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await ContactsModel.getAll();
        res.json({ contacts });
    } catch (error) {
        console.error("Error en getContacts:", error);
        res.status(500).json({ error: "Error al obtener contactos" });
    }
};

export const indexContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await ContactsModel.getAll();
        res.render('admin/contacts', { contacts });
    } catch (error) {
        console.error("Error en indexContacts:", error);
        res.status(500).json({ error: "Error al renderizar contactos" });
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

async function sendEmail(name: string, email: string, message: string, ip: string, country: string, created_at: string) {
    try {
        const mailOptions = {
            from: `"Formulario de Contacto" <${EMAIL_USER}>`,
            to: 'programacion2ais@yopmail.com, manurondon67xdk@gmail.com',
            subject: 'Nuevo formulario de contacto recibido',
            text: `Hola,

Se ha recibido un nuevo formulario de contacto con la siguiente información:

Nombre: ${name}
Correo: ${email}
Comentario: ${message}
Dirección IP: ${ip}
País: ${country}
Fecha/Hora: ${created_at}

Saludos.
`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo enviado correctamente.");
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
}
