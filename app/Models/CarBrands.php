<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarBrands extends Model
{
    use HasFactory;

    protected $table = 'car_brands';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'description',
        'status'
	];

    public function pagingCarBrands ($data) 
	{
		$rows 			= $data->get('per_page');
		$search 		= $data->get('search');
		$fieldsearch 	= $data->get('fieldsearch');
		$val 			= '%'.$search.'%';

		$query = $this->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

	public function showCarBrands ($id) 
	{
		return $this->findOrFail ($id);
	}

	public function storeCarBrands ($data)
	{
		try {
			$category = $this->create($data->except(['id']));

			return responseCreated('Thêm hãng xe thành công!');

		} catch (\Throwable $th) {
			
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}

	}

	public function updateCarBrands ($data, $id) 
	{
		try {
			$category = $this->findOrFail ($id);

			$category->update($data->except(['id','created_at','updated_at']));

			return responseSuccess('Cập nhật hãng xe thành công!');

		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteCarBrands ($id)
	{
		try {
			$category = $this->findOrFail ($id);

			$category->delete();

			return responseSuccess('Xóa hãng xe thành công!');

		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function getCarBrands () {
		return $this->all();
	}
}
