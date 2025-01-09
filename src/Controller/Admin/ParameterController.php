<?php

namespace App\Controller\Admin;

use App\Entity\Parameter\Parameter;
use App\Entity\Parameter\ParametersContainer;
use App\Exception\ApiException;
use App\Form\Admin\Parameter\ParametersContainerType;
use App\Form\Admin\Parameter\ParameterType;
use App\Manager\HookManager;
use App\Manager\LanguageManager;
use App\Manager\ManagerFactory;
use App\Manager\ParameterManager;
use App\Service\Error\FormErrorsCollector;
use App\Service\Log\Logger;
use App\Service\Object\CloneObject;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class ParameterController extends AdminController
{
    protected const ENTITY_CLASS = Parameter::class;
    protected const TYPE_CLASS = ParameterType::class;

    protected const NOT_FOUND_MESSAGE = "Les paramètres n'existent pas.";
    protected const FORM_ERROR_MESSAGE = "Il y a des erreurs dans le formulaire.";

    protected $sf;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        LanguageManager $lm,
        HookManager $hm,
        ManagerFactory $mf,
        ServiceFactory $sf,
    ) {
        parent::__construct($em, $se, $fec, $log, $lm, $hm, $mf);

        $this->sf = $sf;
    }

    #[Rest\Get('/parametres')]
    #[Rest\View(serializerGroups: ['a_all', 'a_parameter_all'])]
    public function getAll(Request $request, ParameterManager $pm): View
    {
        return $this->view($pm->getAllForAdmin(), Response::HTTP_OK);
    }

    #[Rest\Get('/parametres/{parameterKey}', requirements: ['parameterKey' => '.+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_parameter_one'])]
    public function getValue(Request $request, string $parameterKey, ParameterManager $pm): View
    {
        return $this->view($pm->get($parameterKey), Response::HTTP_OK);
    }

    #[Rest\Post('/parametres')]
    #[IsGranted('ROLE_PARAMETER_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_parameter_one'])]
    public function editParameter(Request $request, ParameterManager $pm): View
    {
        $parameters = $request->request->all();
        if (!isset($parameters['parameters'])) {
            throw new ApiException(
                Response::HTTP_BAD_REQUEST,
                1000,
                self::FORM_ERROR_MESSAGE
            );
        }

        $parametersContainer = new ParametersContainer();
        for ($i = 0; $i < count($parameters['parameters']); ++$i) {
            $parameterRequest = $parameters['parameters'][$i];

            $parameter = $pm->getParameter($parameterRequest['paramKey']);
            $parametersContainer->addParameter($parameter);

            $parameters['parameters'][$i] = ['paramValue' => $parameterRequest['paramValue']];
        }

        $iObject = CloneObject::cloneObject($parametersContainer);

        $form = $this->createForm(
            ParametersContainerType::class,
            $parametersContainer
        );
        $fields = array_replace_recursive($parameters, $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);
            throw new ApiException(
                Response::HTTP_BAD_REQUEST,
                1000,
                self::FORM_ERROR_MESSAGE,
                $errors
            );
        }

        $parameters = $parametersContainer->getParameters();

        $this->hm->exec('ParameterValidated', [
            'iObject' => $iObject,
            'vObject' => $parameters,
            'state'   => 'edit'
        ]);

        foreach ($parameters as $parameter) {
            $this->em->persist($parameter);
        }
        $this->em->flush();

        $this->hm->exec('ParameterSaved', [
            'iObject' => $iObject,
            'sObject' => $parameters,
            'state'   => 'edit'
        ]);

        return $this->view($parametersContainer, Response::HTTP_OK);
    }

    #[Rest\Post('/parametres/generer/seo')]
    #[IsGranted('ROLE_PARAMETER_EXECUTE')]
    public function generateRobotFile(Request $request): View
    {
        $this->mf->get('parameter')->createRobotFile($request->getScheme() . "://" . $request->getHost());
        $this->mf->get('parameter')->createSitemapFile($request->getScheme() . "://" . $request->getHost());

        return $this->view([], Response::HTTP_OK);
    }

    #[Rest\Post('/parametres/email-test')]
    #[IsGranted('ROLE_PARAMETER_EXECUTE')]
    public function sendTestEmail(): View
    {
        $testEmailAddress = $this->mf->get('parameter')->getCoreParameter('test_email_address');
        if (null === $testEmailAddress) {
            throw new ApiException(
                Response::HTTP_BAD_REQUEST,
                1000,
                "Veuillez renseigner une adresse email pour le test"
            );
        }

        $this->sf->get('mailer')->sendTestEmail($testEmailAddress);

        return $this->view([], Response::HTTP_OK);
    }
}
