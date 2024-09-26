// src/mail/mail.service.ts

import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly transporter

  constructor () {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // Utilise TLS avec le port 587
      auth: {
        user: 'julien.paillassa@ynov.com', // Définissez ces valeurs dans votre fichier .env
        pass: '@Kimimaro1994' // Utilisez des variables d'environnement pour la sécurité
      },
      tls: {
        ciphers: 'SSLv3' // Ajout optionnel pour forcer certains niveaux de chiffrement
      }
    })
  }

  async sendPaymentConfirmationEmail (): Promise<void> {
    const mailOptions = {
      from: 'julien.paillassa@ynov.com', // Remplacez par votre adresse email
      to: 'j.paillassa@fondationccv.org',
      subject: 'Confirmation de paiement',
      text: 'Votre paiement a été reçu avec succès.'
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendEmail (): Promise<void> {
    const mailOptions = {
      from: 'julien.paillassa@ynov.com', // Remplacez par votre adresse email
      to: 'j.paillassa@fondationccv.org',
      subject: 'Confirmation de paiement',
      text: 'Votre paiement a été reçu avec succès. Le montant payé est de 1000 EUR.'
    }

    await this.transporter.sendMail(mailOptions)
  }
}
