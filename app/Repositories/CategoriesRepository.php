<?php 
    namespace App\Repositories;
    use Illuminate\Http\Request;
    use App\Models\Categories;

    class CategoriesRepository implements BaseRepositoryInterface{ 

        protected $category;
    
        public function __construct(Categories $category){
            $this->category = $category;
        }

        public function getAll ($data) 
        {
            return $this->category->getAllCategory ($data);
        }

        public function store ($data) 
        {
            return $this->category->storeCategory ($data);
        }
        
        public function show ($id) 
        {
            return $this->category->showCategory ($id);
        }

        public function update ($data, $id) 
        {
            return $this->category->updateCategory ($data, $id);
        }

        public function destroy ($id) 
        {
            return $this->category->destroyCategory ($id);
        }
    }

?>