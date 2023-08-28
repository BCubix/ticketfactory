<?php

namespace App\Controller\Website;

use App\Entity\ContactRequest\ContactRequest;
use App\Entity\Page\Page;
use App\Form\Website\ContactRequest\ContactRequestType;

use Symfony\Component\HttpFoundation\Request;

class ContactController extends WebsiteController
{
    public function index(Request $request, Page $page)
    {
        $object = new ContactRequest();
        $object->setActive(false);

        $form = $this->createForm(ContactRequestType::class, $object);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($object);
            $this->em->flush();

            $this->addFlash('contact-success', "Votre message à bien été envoyé");

            return $this->redirect($this->sf->get('urlService')->keywordPath('contact', []));
        }

        return $this->websiteRender('Contact/index.html.twig', [
            'page'    => $page,
            'contact' => $object,
            'form' => $form->createView()
        ]);
    }
}
