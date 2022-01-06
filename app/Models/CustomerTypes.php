<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerTypes extends Model
{
    use HasFactory;


    protected $table = 'customer_types';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'description'
	];

    public function pagingCustomerTypes ($data) 
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

	public function storeCustomerTypes ($data)
	{
		try {
			$this->create($data->except(['id','first_debt']));

			return responseCreated('Thêm nhóm khách công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showCustomerTypes ($id) 
	{
		return $this->findOrFail ($id);
	}

	public function updateCustomerTypes ($data, $id)
	{
		try {
			$customerType = $this->findOrFail ($id);


			$customerType->update($data->except(['id','created_at','updated_at']));

            return responseSuccess('Cập nhật nhóm khách thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteCustomerTypes ($id)
	{
		try {
			$customerType = $this->findOrFail ($id);

			$customerType->delete();

            return responseSuccess('Xóa nhóm khách thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}
}
