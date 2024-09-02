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
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $pageTypeBlocks = [];
        foreach ($page->getContents() as $content) {
            foreach ($content->getFields() as $key => $field) {
                $pageTypeBlocks[$key] = $field;
            }
        }

        $object = new ContactRequest();
        $object->setActive(false);

        $form = $this->createForm(ContactRequestType::class, $object);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->mf->get("hook")->exec("actionFormValidated", [
                'vObject' => $object,
            ]);

            $this->sf->get('mailer')->sendContactRequestEmail($object);

            $this->em->persist($object);
            $this->em->flush();

            $this->addFlash('contact-success', "Votre message à bien été envoyé");

            return $this->redirect($this->sf->get('urlService')->keywordPath('contact', []));
        }

        return $this->websiteRender('Contact/index.html.twig', [
            'breadcrumbs'    => $breadcrumbs,
            'page'           => $page,
            'contact'        => $object,
            'pageTypeBlocks' => $pageTypeBlocks,
            'form'           => $form->createView()
        ]);
    }
}
