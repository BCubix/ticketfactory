<?php

namespace App\Controller\Admin;

use App\Entity\Technical\Note;
use App\Form\Admin\Technical\NoteType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class NoteController extends AdminController
{
    protected const ENTITY_CLASS = Note::class;
    protected const TYPE_CLASS = NoteType::class;

    protected const NOT_FOUND_MESSAGE = "Cet élément note n'existe pas.";

    #[Rest\Get('/note')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_note_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $notes = $this->em->getRepository(Note::class)->findAll();
        return $this->view($notes);
    }

    #[Rest\Post('/note')]
    #[Rest\View(serializerGroups: ['a_all', 'a_note_one'])]
    public function add(Request $request): View
    {
        $note = new Note();
        $data = $request->getContent();
        $note->setMessage($data);
        $note->setUser($this->getUser());

        $this->em->persist($note);
        $this->em->flush();

        return $this->view($note);
    }

    #[Rest\Post('/note/{noteId}', requirements: ['noteId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_note_one'])]
    public function edit(Request $request, int $noteId): View
    {
        $note = $this->em->getRepository(Note::class)->find($noteId);

        if (!$note) {
            throw new NotFoundHttpException(self::NOT_FOUND_MESSAGE);
        }

        $data = json_decode($request->getContent(), true);
        $note->setMessage($data['message']);

        $this->em->flush();

        return $this->view($note);
    }

    #[Rest\Delete('/note/{noteId}', requirements: ['noteId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_note_one'])]
    public function delete(Request $request, int $noteId): View
    {
        $note = $this->em->getRepository(Note::class)->find($noteId);

        if (!$note) {
            throw new NotFoundHttpException(self::NOT_FOUND_MESSAGE);
        }
        
        $this->em->remove($note);
        $this->em->flush();

        return $this->view(['status' => 'Note deleted successfully']);
    }

}
