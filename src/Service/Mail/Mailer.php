<?php

namespace App\Service\Mail;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class Mailer
{
    public const SERVICE_NAME = 'mailer';

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
            ->htmlTemplate('Admin/default/Email/reset-password.html.twig')
            ->context([
                'user' => $user,
                'path' => $path
            ])
        ;

        $this->mailer->send($message);
    }
}
