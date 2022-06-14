<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Response;

class ApiException extends HttpException
{
    /**
     * @var array
     */
    protected $errors;

    /**
     * @param string $httpCode         HTTP code
     * @param string $statusCode       Internal status code
     * @param string $message          A human-readable text providing additional information
     * @param array  $array            List of the form errors
     */
    public function __construct($httpCode, $statusCode, $message = null, $errors = [])
    {
        parent::__construct($httpCode, $message, null, $this->getResponseHeaders(), $statusCode);

        $this->errors = $errors;
    }

    public function getErrors(): ?array
    {
        return $this->errors;
    }

    public function setErrors(array $errors): self
    {
        $this->errors = $errors;

        return $this;
    }

    /**
     * Get HTTP Error Response
     *
     * @return Response
     *
     * @see http://tools.ietf.org/html/draft-ietf-oauth-v2-20#section-5.1
     * @see http://tools.ietf.org/html/draft-ietf-oauth-v2-20#section-5.2
     *
     * @ingroup oauth2_error
     */
    public function getHttpResponse()
    {
        return new Response(
            $this->getResponseBody(),
            $this->getHttpCode(),
            $this->getResponseHeaders()
        );
    }

    /**
     * Get HTTP Error Response headers
     *
     * @return array
     *
     * @see http://tools.ietf.org/html/draft-ietf-oauth-v2-20#section-5.2
     *
     */
    public function getResponseHeaders()
    {
        return array(
            'Content-Type' => 'application/json',
            'Cache-Control' => 'no-store',
            'Pragma' => 'no-cache',
        );
    }
}
