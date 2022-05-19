<?php

class Database{
    private $host;
    private $db;
    private $user;
    private $password;
    private $charset;
    public function __construct(){
        $this->host = 'localhost';
        $this->db = 'ilegal';
        $this->user = 'root';
        $this->password = 'root';
        $this->charset = 'utf8mb4';
    }
    function connect(){
        try{
            $connection = "mysql:host=" . $this->host . ";dbname=" . $this->db . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($connection, $this->user, $this->password, $options);
            print_r('conexion exitosa');
            return $pdo;
        }catch(PDOException $e){
            return false;
            print_r('Error de  conexión: ' . $e->getMessage());
        }
    }
}



?>