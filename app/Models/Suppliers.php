<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\LeadSuppliers;

class Suppliers extends Model
{
    use HasFactory;

    protected $table = 'suppliers';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'phone',
        'address',
        'email',
        'website',
        'tax_code',
        'account_number',
        'bank_name',
        'first_debt',
        'name_represent',
		'card_id_rep'
	];


    public function pagingSuppliers ($data) 
	{
		$rows = $data->get('per_page');
		$search = $data->get('search');
		$fieldsearch = $data->get('fieldsearch');
		$val = '%'.$search.'%';

		$query = $this->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});
		
		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

	public function storeSuppliers ($data)
	{
		try {
			$this->create($data->except(['id','first_debt']));

			return responseCreated('Thêm nhà cung cấp thành công!');

		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showSuppliers ($id) 
	{
		return $this->findOrFail ($id);
	}

	public function updateSuppliers ($data, $id)
	{
		try {
			$supplier = $this->findOrFail ($id);

			$supplier->update($data->except(['id','created_at','updated_at']));

			return responseSuccess('Cập nhật thông tin nhà cung cấp thành công!');
			
		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteSuppliers ($id)
	{
		try {
			$supplier = $this->findOrFail ($id);
			
			$supplier->delete();

			return responseSuccess('Xóa nhà cung cấp thành công!');

		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}
}
