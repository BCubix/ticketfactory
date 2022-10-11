<?php

namespace App\Service\Mailer;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class Mailer
{
    private $mailer;
    private $sender;

    public function __construct(MailerInterface $mailer) {
        $this->mailer = $mailer;
        $this->sender = 'hi@sender.com';
    }

    public function sendResetPasswordEmail($user, $path) {
        $message = (new TemplatedEmail())
            ->from($this->sender)
            ->to($user->getEmail())
            ->subject('Réinitialisation du mot de passe')
            ->htmlTemplate('Email/reset-password.html.twig')
            ->context([
                'user' => $user,
                'path' => $path
            ])
        ;

        $this->mailer->send($message);
    }
}
