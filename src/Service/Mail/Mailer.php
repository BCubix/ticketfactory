<?php

namespace App\Service\Mail;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

use App\Entity\Customer\Customer;
use App\Manager\ManagerFactory;

class Mailer
{
    public const SERVICE_NAME = 'mailer';

    private $mailer;
    private $mf;

    public function __construct(MailerInterface $mailer, ManagerFactory $mf) {
        $this->mailer = $mailer;
        $this->mf = $mf;
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

    public function sendRegistrationEmail(Customer $customer, string $path) {
        $emailTemplate = $this->mf->get("theme")->getWebsiteTemplatesPath() . "Email/customer-registration.html.twig";
        $sender = $this->mf->get("parameter")->get("email_sender");


        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($customer->getEmail())
            ->subject('Validation de votre adresse email')
            ->htmlTemplate($emailTemplate)
            ->context([
                'customer' => $customer,
                'path'     => $path
            ])
        ;

        $this->mailer->send($message);
    }
}
