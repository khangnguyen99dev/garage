<?php 
    namespace App\Repositories;
    use App\Repositories\BaseRepositoryInterface;

    interface BaseRepositoryInterface{   

        public function getAll ($request);

        public function store ($data);

        public function show ($id);

        public function update ($data, $id);

        public function destroy ($id);
    }
?>