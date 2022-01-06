<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menus extends Model
{
    use HasFactory;

    protected $table = 'menus';
	protected $guarded = array('id');

    protected $fillable = [
        'label',
        'link',
        'description',
        'sort',
		'icon'
	];

    public function pagingMenus ($data) 
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

        $data = $rows ? $query->orderBy('sort','ASC')->paginate($rows) : $query->orderBy('sort','ASC')->get();

		return $data;
	}

    public function storeMenus ($data)
	{
		try {
			$this->create($data->except(['id']));

			return responseCreated('Thêm chức năng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showMenus ($id) 
	{
		return $this->findOrFail ($id);
	}

	public function updateMenus ($data, $id)
	{
		try {
			$menu = $this->findOrFail ($id);

			$menu->update($data->except(['id','created_at','updated_at']));

            return responseSuccess('Cập nhật chức năng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteMenus ($id)
	{
		try {
			$menu = $this->findOrFail ($id);

			$menu->delete();

            return responseSuccess('Xóa chức năng thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}   
}
