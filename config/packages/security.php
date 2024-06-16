<?php
// src/Security/SecurityConfiguration.php

namespace App\Security;

use App\Service\Db\Db;
use Gesdinet\JWTRefreshTokenBundle\Security\Http\Authenticator\RefreshTokenAuthenticator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Http\Firewall\Config\SecurityConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\Security\Core\User\UserChecker;

class SecurityConfiguration extends AbstractController
{
    public function configure(ContainerBuilder $container, array $config): void
    {
        $FrontSessionDuration = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'core_front_session_duration'");
        $BackSessionDuration = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'core_back_session_duration'");

        $container->register('gesdinet.jwtrefreshtoken.authenticator', RefreshTokenAuthenticator::class)
                  ->setArgument('$userChecker', new Reference('security.user_checker'));

        $container->loadFromExtension('security', [
            'password_hashers' => [
                PasswordAuthenticatedUserInterface::class => 'auto',
            ],
            'providers' => [
                'tf_customer_provider' => [
                    'entity' => [
                        'class' => 'App\Entity\Customer\Customer',
                    ],
                ],
                'tf_user_provider' => [
                    'entity' => [
                        'class' => 'App\Entity\User\User',
                    ],
                ],
            ],
            'firewalls' => [
                'dev' => [
                    'pattern' => '^/(_(profiler|wdt)|css|images|js)/',
                    'security' => false,
                ],
                'admin' => [
                    'pattern' => '^/admin',
                    'provider' => 'tf_user_provider',
                    'stateless' => true,
                    'entry_point' => 'jwt',
                    'json_login' => [
                        'check_path' => 'admin_api_login_check',
                        'success_handler' => 'lexik_jwt_authentication.handler.authentication_success',
                        'failure_handler' => 'lexik_jwt_authentication.handler.authentication_failure',
                    ],
                    'jwt' => '~',
                    'refresh_jwt' => [
                        'check_path' => 'admin_api_refresh_token',
                    ],
                ],
                'refresh' => [
                    'pattern' => '^/admin/api/token/refresh',
                    'stateless' => true,
                ],
                'tunnel' => [
                    'pattern' => '^/commande',
                    'provider' => 'tf_customer_provider',
                    'context' => 'customer_context',
                    'form_login' => [
                        'login_path' => 'tf_website_order_connection',
                        'check_path' => 'tf_website_order_login',
                        'use_referer' => true,
                        'enable_csrf' => true,
                    ],
                    'logout' => [
                        'path' => 'tf_website_logout',
                        'target' => 'tf_website_order_connection',
                    ],
                ],
                'main' => [
                    'pattern' => '^/',
                    'provider' => 'tf_customer_provider',
                    'context' => 'customer_context',
                    'form_login' => [
                        'login_path' => 'tf_website_connection',
                        'check_path' => 'tf_website_login',
                        'use_referer' => true,
                        'enable_csrf' => true,
                    ],
                    'logout' => [
                        'path' => 'tf_website_logout',
                        'target' => 'tf_website_connection',
                    ],
                ],
            ],
            'access_control' => [
                ['path' => '^/admin/api/(login|token/refresh)', 'roles' => 'PUBLIC_ACCESS'],
                ['path' => '^/admin/api/modules/module-image/*', 'roles' => 'PUBLIC_ACCESS'],
                ['path' => '^/admin/api/themes/theme-image/*', 'roles' => 'PUBLIC_ACCESS'],
                ['path' => '^/admin/api/forgot-password', 'roles' => 'PUBLIC_ACCESS'],
                ['path' => '^/admin/api/reset-password', 'roles' => 'PUBLIC_ACCESS'],
                ['path' => '^/admin/api', 'roles' => 'ROLE_ADMIN'],
                ['path' => '^/mon-compte/(login|logout|connexion)', 'roles' => 'PUBLIC_ACCESS'],
                ['path' => '^/mon-compte', 'roles' => 'ROLE_CUSTOMER'],
                ['path' => '^/commande/(login|logout|connexion)', 'roles' => 'PUBLIC_ACCESS'],
                ['path' => '^/commande/*', 'roles' => 'ROLE_CUSTOMER'],
            ],
        ]);
    }
}
