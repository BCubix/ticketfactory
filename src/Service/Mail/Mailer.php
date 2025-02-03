<?php

namespace App\Service\Mail;

use App\Entity\ContactRequest\ContactRequest;
use App\Entity\Customer\Customer;
use App\Entity\Order\Cart;
use App\Entity\Product\Product;
use App\Manager\ManagerFactory;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

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
        $emailTemplate = $this->mf->get("theme")->getAdminTemplatesPath() . "Email/reset-password.html.twig";
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

    public function sendContactRequestEmail(ContactRequest $object): void
    {
        $emailTemplate = $this->mf->get("theme")->getWebsiteTemplatesPath() . "Email/contact-request.html.twig";
        $sender = $this->mf->get("parameter")->getCoreParameter("email_sender");
        $receiver = $this->mf->get("parameter")->getCoreParameter("email_contact_request_receiver");

        if (null === $sender || null === $receiver) {
            return;
        }

        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($receiver)
            ->subject("Demande de contact")
            ->htmlTemplate($emailTemplate)
            ->context([
                'message' => $object
            ]);

        $this->mailer->send($message);
    }

    public function sendEmailValidatedOrder(Cart $cart): void
    {
        $emailTemplate = $this->mf->get("theme")->getWebsiteTemplatesPath() . "Email/validated-order.html.twig";

        $sender = $this->mf->get("parameter")->getCoreParameter("email_sender");
        $receiver = $this->mf->get('parameter')->getCoreParameter("order_validated_email");

        if (null === $sender || null === $receiver) {
            return;
        }

        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($receiver)
            ->subject('Nouvelle commande')
            ->htmlTemplate($emailTemplate)
            ->context([
                'cart' => $cart
            ]);

        $this->mailer->send($message);
    }

    public function sendEmailProductOutOfStock(Product $product): void
    {
        $emailTemplate = $this->mf->get("theme")->getWebsiteTemplatesPath() . "Email/product-out-of-stock.html.twig";

        $sender = $this->mf->get("parameter")->getCoreParameter("email_sender");
        $receiver = $this->mf->get('parameter')->getCoreParameter("product_out_of_stock_email");

        if (null === $sender || null === $receiver) {
            return;
        }

        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($receiver)
            ->subject("Un produit n'est plus en stock")
            ->htmlTemplate($emailTemplate)
            ->context([
                'product' => $product
            ]);

        $this->mailer->send($message);
    }

    public function sendTestEmail(string $testEmailAddress)
    {
        $sender = $this->mf->get("parameter")->getCoreParameter("email_sender");

        $message = (new TemplatedEmail())
            ->from($sender)
            ->to($testEmailAddress)
            ->subject('Email de test')
            ->text('Email de test');

        $this->mailer->send($message);
    }
}
