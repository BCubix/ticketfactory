<?php

namespace App\Controller\Admin;

use App\Entity\Technical\ToDoTask;
use App\Form\Admin\Technical\ToDoTaskType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class ToDoTaskController extends AdminController
{
    
    #[Rest\Get('/toDoTask')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_to_do_task_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $toDo = $this->em->getRepository(ToDoTask::class)->findAll();
        return $this->view($toDo);
    }

    #[Rest\Post('/toDoTask')]
    #[Rest\View(serializerGroups: ['a_all', 'a_to_do_task_one'])]
    public function add(Request $request): View
    {
        $toDoTask = new ToDoTask();
        $data = $request->getContent();
        $toDoTask->setMessage($data);
        $toDoTask->setUser($this->getUser());

        $this->em->persist($toDoTask);
        $this->em->flush();

        return $this->view($toDoTask);
    }

    #[Rest\Post('/toDoTask/{toDoTaskId}', requirements: ['toDoTaskId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_to_do_task_one'])]
    public function edit(Request $request, int $toDoTaskId): View
    {
        $toDoTask = $this->em->getRepository(ToDoTask::class)->find($toDoTaskId);

        if (!$toDoTask) {
            throw new NotFoundHttpException(self::NOT_FOUND_MESSAGE);
        }

        $data = json_decode($request->getContent(), true);
        $toDoTask->setMessage($data['message']);

        $this->em->flush();

        return $this->view($toDoTask);
    }

    #[Rest\Delete('/toDoTask/{toDoTaskId}', requirements: ['toDoTaskId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_to_do_task_one'])]
    public function delete(Request $request, int $toDoTaskId): View
    {
        $toDoTask = $this->em->getRepository(ToDoTask::class)->find($toDoTaskId);

        if (!$toDoTask) {
            throw new NotFoundHttpException(self::NOT_FOUND_MESSAGE);
        }
        
        $this->em->remove($toDoTask);
        $this->em->flush();

        return $this->view(['status' => 'ToDoTask deleted successfully']);
    }
}
