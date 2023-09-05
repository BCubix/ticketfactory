<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Customer\Customer;
use App\Form\Website\Customer\CustomerType;

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
            return $this->redirect($homeUrl);
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
            'login_error'    => $error
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
            $this->addFlash('error', 'Votre adresse email n\'a pas été trouvée ou a été déjà validée. Veuillez contacter nos équipes pour tenter de résoudre le problème.');
        }

        return $this->redirectToRoute("tf_website_connection");
    }
}
