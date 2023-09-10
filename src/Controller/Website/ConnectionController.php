<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Customer\Customer;
use App\Form\Website\Customer\CustomerType;
use App\Form\Website\Customer\ResetCustomerPasswordType;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class ConnectionController extends WebsiteController
{
    #[Route('/mon-compte/login', name: 'tf_website_login', priority: 1)]
    public function login()
    {
        return $this->redirectToRoute("tf_website_connection");
    }

    #[Route('/mon-compte/logout', name: 'tf_website_logout', priority: 1)]
    public function logoutAction(): void
    {
        throw new \Exception('Don\'t forget to activate logout in security.yaml');
    }

    #[Route('/mon-compte/connexion', name: 'tf_website_connection', priority: 1)]
    public function index(Request $request, AuthenticationUtils $authenticationUtils)
    {
        $homeUrl = $this->sf->get('urlService')->keywordPath('home');
        $page = $this->mf->get('page')->getByKeyword('connection');

        if (null !== $this->getUser()) {
            return $this->redirectToRoute("tf_website_account");
        }

        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        $customer = new Customer();
        $customer->setActive(false);

        $signupForm = $this->createForm(CustomerType::class, $customer);
        $signupForm->handleRequest($request);

        if ($signupForm->isSubmitted() && $signupForm->isValid()) {
            $customerBase = $this->em->getRepository(Customer::class)->findOneByEmail($customer->getEmail());
            if (null === $customerBase) {
                $this->mf->get("customer")->checkEmailAddress($customer);
                $this->em->persist($customer);

                $this->mf->get("customer")->upgradePassword($customer);
                $this->em->flush();

                $this->addFlash('Succès',  "Votre inscription a bien été prise en compte. Veuillez confirmer votre adresse email.");

                return $this->redirect($homeUrl);
            }

            $this->addFlash('Erreur',  "Un compte avec cette adresse email existe déjà.");
        }

        return $this->websiteRender('Connection/index.html.twig', [
            'page'           => $page,
            'signupForm'     => $signupForm->createView(),
            'last_username'  => $lastUsername,
            'login_error'    => $error,
            'signinPath'     => $this->generateUrl('tf_website_login'),
        ]);
    }

    #[Route("/mot-de-passe-oublie", name: 'tf_website_forgot_password', priority: 1)]
    public function forgotPassword(Request $request)
    {
        $email = $request->get("username");
        $customer = $this->em->getRepository(Customer::class)->loadUserByIdentifier($email);

        if (null === $customer) {
            return $this->websiteRender("_partials/_notification.html.twig", [
                'title' => 'Erreur',
                'message' => "Aucun compte n'a été trouvé pour cette adresse email ou celui-ci est désactivé."
            ]);
        }

        $this->mf->get("customer")->forgotPassword($customer);
        $this->em->flush();

        return $this->websiteRender("_partials/_notification.html.twig", [
            'title' => 'Succès',
            'message' => "Un email à été envoyé à l'adresse indiqué pour réinitialiser votre mot de passe."
        ]);
    }

    #[Route("/reinitialiser-mot-de-passe", name: "tf_website_reset_password", priority: 1)]
    public function resetPassword(Request $request)
    {
        $email = $request->get("email");
        $token = $request->get("token");

        if (null === $email || null === $token) {
            throw $this->createNotFoundException('Il manque une information.');
        }

        $customer = $this->em->getRepository(Customer::class)->findOneByUidForFront($email, $token);
        if (null === $customer) {
            throw $this->createNotFoundException('Aucun compte client n\'a été trouvé.');
        }

        $resetForm = $this->createForm(ResetCustomerPasswordType::class, $customer);
        $resetForm->handleRequest($request);

        if ($resetForm->isSubmitted() && $resetForm->isValid()) {
            $this->mf->get("customer")->upgradePassword($customer);
            $this->em->flush();

            $this->addFlash('Succès',  "Votre mot de passe à bien été réinitialisé.");

            return $this->redirectToRoute("tf_website_connection");
        }

        return $this->websiteRender("Connection/reset-password.html.twig", [
            'resetForm' => $resetForm->createView(),
        ]);
    }

    #[Route("/email-validation", name: "tf_website_email_validation", priority: 1)]
    public function validationAction(Request $request)
    {
        $email = $request->get('email');
        $token = $request->get('token');

        $emailValid = false;
        $customer = $this->em->getRepository(Customer::class)->findOneByUidForFront($email, $token);

        if (null !== $customer) {
            $customer->setActive(true);
            $customer->setEmailToken(null);

            $this->em->persist($customer);
            $this->em->flush();

            $this->addFlash('notice', 'Votre adresse email a bien été validée.');
        } else {
            $this->addFlash('error', "Votre adresse email n'a pas été trouvée ou a été déjà validée. Veuillez contacter nos équipes pour tenter de résoudre le problème.");
        }

        return $this->redirectToRoute("tf_website_connection");
    }
}
