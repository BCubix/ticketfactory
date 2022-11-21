<?php

namespace App\Service\Db;

use App\Exception\ApiException;
use Symfony\Component\HttpFoundation\Response;

class Db
{
    protected static $instance;

    private $host;
    private $user;
    private $password;
    private $dbname;

    public static function getInstance(): Db
    {
        if (!static::$instance) {
            $pattern = '/[^:]*\:\/\/(?<user>[^:]*)\:(?<password>[^@]*)@(?<host>[^\/]*)\/(?<dbname>[^?]*)/';
            preg_match($pattern, $_ENV['DATABASE_URL'], $matches);

            $host = $matches['host'];
            $user = $matches['user'];
            $password = $matches['password'];
            $dbname = $matches['dbname'];

            static::$instance = new static($host, $user, $password, $dbname);
        }

        return static::$instance;
    }

    private function __construct(string $host, string $user, string $password, string $dbname)
    {
        $this->host = $host;
        $this->user = $user;
        $this->password = $password;
        $this->dbname = $dbname;
    }

    public function getDbname(): string
    {
        return $this->dbname;
    }

    public function query(string $query): array
    {
        $conn = new \mysqli($this->host, $this->user, $this->password, $this->dbname);
        if ($conn->connect_errno) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La connexion à la base a échoué.");
        }

        $data = [];
        $result = null;
        try {
            $result = $conn->query($query);
        } catch (\Exception $e) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La requête SQL a échoué : '{$query}'.");
        }

        if ($result instanceof \mysqli_result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

        $conn->close();

        return $data;
    }
}