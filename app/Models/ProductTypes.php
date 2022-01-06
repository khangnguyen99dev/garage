<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categories;

class ProductTypes extends Model
{
    use HasFactory;

    protected $table = 'product_types';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
		'category_id',
        'description',
        'status'
	];

	public function Categories ()
    {
        return $this->belongsto(Categories::class, 'category_id');
    }

    public function pagingProductTypes ($data) 
	{
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';

		$query = $this->join('categories', 'categories.id', 'product_types.category_id')
		->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

		$query->select('product_types.*','categories.name as name_category');

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

    public function storeProductTypes ($data)
	{
		try {
			$this->create($data->except(['id']));

			return responseCreated('Thêm loại phụ tùng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showProductTypes ($id) 
	{
		return $this->with('Categories')->where('id', $id)->first();
	}

	public function updateProductTypes ($data, $id)
	{
		try {
			$productType = $this->findOrFail ($id);


			$productType->update($data->except(['id','created_at','updated_at']));

            return responseSuccess('Cập nhật loại phụ tùng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteProductTypes ($id)
	{
		try {
			$productType = $this->findOrFail ($id);

			$productType->delete();

            return responseSuccess('Xóa loại phụ tùng thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}   
}
