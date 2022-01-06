<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceTypes extends Model
{
    use HasFactory;

    protected $table = 'service_types';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'description',
        'status'
	];

    public function pagingServiceTypes($data) 
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

	public function storeServiceTypes($data)
	{
		try {
			$this->create($data->except(['id']));

			return responseCreated('Thêm loại dịch vụ thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showServiceTypes($id) 
	{
		return $this->findOrFail ($id);
	}

	public function updateServiceTypes($data, $id)
	{
		try {
			$service_type = $this->findOrFail ($id);

			$service_type->update($data->except(['id','created_at','updated_at']));

            return responseSuccess('Cập nhật loại dịch vụ hàng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteServiceTypes($id)
	{
		try {
			$service_type = $this->findOrFail ($id);

			$service_type->delete();

            return responseSuccess('Xóa loại dịch vụ hàng thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}
}
