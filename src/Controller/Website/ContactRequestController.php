<?php

namespace App\Controller\Website;

use App\Entity\ContactRequest\ContactRequest;
use App\Form\Website\ContactRequest\ContactRequestType;

use Symfony\Component\HttpFoundation\Request;

class ContactRequestController extends WebsiteController
{
    public function index(Request $request)
    {
        $page = $this->mf->get('page')->getByKeyword('contact');

        $object = new ContactRequest();
        $object->setActive(true);

        $form = $this->createForm(ContactRequestType::class, $object, ['operation' => 'add']);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($object);
            $this->em->flush();

            $this->addFlash('contact-success', "Votre message à bien été envoyé");

            return $this->redirect($this->sf->get('urlService')->keywordPath('home', []));
        }

        return $this->websiteRender('Contact/index.html.twig', ['contact' => $object, 'form' => $form->createView()]);
    }
}
