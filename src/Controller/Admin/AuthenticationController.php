<?php

namespace App\Controller\Admin;

use App\Entity\User\User;
use App\Exception\ApiException;
use App\Manager\UserManager;
use App\Service\Mailer\Mailer;
use App\Utils\FormErrorsCollector;
use App\Utils\TokenGenerator;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticationController extends AdminController
{
    #[Rest\Post('/forgot-password')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function forgotPassword(Request $request, Mailer $mailer): View
    {
        $data = $this->se->deserialize($request->getContent(), 'array', 'json');
        if (!isset($data['username'])) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'L\'email n\'est pas renseigné.');
        }

        $username = $data['username'];
        $user = $this->em->getRepository(User::class)->loadUserByIdentifier($username);
        if (null === $user) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, 'Aucun compte n\'a été trouvé avec cette adresse mail.');
        }

        $user->setEmailToken(TokenGenerator::generateToken());
        $user->setPasswordRequestedAt(new \DateTime());
        $this->em->persist($user);
        $this->em->flush();

        $path = '/admin/modifier-mon-mot-de-passe?email=' . urlencode($user->getEmail()) . '&token=' . urlencode($user->getEmailToken());
        $mailer->sendResetPasswordEmail($user, $path);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Rest\Post("/reset-password")
     * @Rest\View(serializerGroups={"impuls_security"})
     */
    public function resetPassword(Request $request, UserManager $um): View
    {
        $data = $this->se->deserialize($request->getContent(), 'array', 'json');
        if (empty($data['username']) || empty($data['token']) || empty($data['newPassword'])) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Au moins un paramètre est manquant.');
        }

        $username = $data['username'];
        $token = $data['token'];
        $newPassword = $data['newPassword'];

        $user = $this->em->getRepository(User::class)->loadUserByIdentifier($username);
        if (null === $user) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1200, 'Aucun compte n\'a été trouvé avec cette adresse mail.');
        }

        $currentDateTime = new \DateTime();
        $currentDateTime->sub(new \DateInterval('PT15M'));
        if ($user->getPasswordRequestedAt() < $currentDateTime) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, 'La demande de réinitialisation est expirée. Veuillez recommencer la procédure.');
        }

        if ($user->getEmailToken() != $token) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, 'Il semble y avoir eu un problème. Veuillez recommencer la procédure.');
        }

        $user->setPlainPassword($newPassword);
        $um->upgradePassword($user);

        $this->em->flush();

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }
}
