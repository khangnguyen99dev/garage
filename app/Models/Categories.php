<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $table = 'categories';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'description',
	];

    public function pagingCategories ($data) 
	{
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';

		$query = $this->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

        $data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

    public function storeCategories ($data)
	{
		try {
			$this->create($data->except(['id']));

			return responseCreated('Thêm danh mục phụ tùng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showCategories ($id) 
	{
		return $this->findOrFail ($id);
	}

	public function updateCategories ($data, $id)
	{
		try {
			$category = $this->findOrFail ($id);

			$category->update($data->except(['id','created_at','updated_at']));

            return responseSuccess('Cập nhật danh mục phụ tùng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteCategories ($id)
	{
		try {
			$category = $this->findOrFail ($id);

			$category->delete();

            return responseSuccess('Xóa danh mục phụ tùng thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}  
	
	public function getCategories () {
		return $this->all();
	}
}
