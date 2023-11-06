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

    public function __construct(MailerInterface $mailer, ManagerFactory $mf)
    {
        $this->mailer = $mailer;
        $this->mf = $mf;
    }

    public function sendResetCustomerPasswordEmail($customer, $path)
    {
        $emailTemplate = $this->mf->get("theme")->getWebsiteTemplatesPath() . "Email/reset-password.html.twig";
        $sender = $this->mf->get("parameter")->getCoreParameter("email_sender");

        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($customer->getEmail())
            ->subject('Réinitialisation du mot de passe')
            ->htmlTemplate($emailTemplate)
            ->context([
                'customer' => $customer,
                'path' => $path
            ]);

        $this->mailer->send($message);
    }

    public function sendResetUserPasswordEmail($user, $path)
    {
        $emailTemplate = $this->mf->get("theme")->getWebsiteTemplatesPath() . "Email/reset-password.html.twig";
        $sender = $this->mf->get("parameter")->getCoreParameter("email_sender");

        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($user->getEmail())
            ->subject('Réinitialisation du mot de passe')
            ->htmlTemplate($emailTemplate)
            ->context([
                'user' => $user,
                'path' => $path
            ]);

        $this->mailer->send($message);
    }

    public function sendRegistrationEmail(Customer $customer, string $path)
    {
        $emailTemplate = $this->mf->get("theme")->getWebsiteTemplatesPath() . "Email/customer-registration.html.twig";
        $sender = $this->mf->get("parameter")->getCoreParameter("email_sender");


        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($customer->getEmail())
            ->subject('Validation de votre adresse email')
            ->htmlTemplate($emailTemplate)
            ->context([
                'customer' => $customer,
                'path'     => $path
            ]);

        $this->mailer->send($message);
    }
}
