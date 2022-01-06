<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Menus;

class Roles extends Model
{
    use HasFactory;

    protected $table = 'roles';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'description',
	];

    public function Menus () 
    {
        return $this->belongsToMany(Menus::class , 'default_roles', 'role_id', 'menu_id')->selectRaw('*')->orderby('sort','ASC');
    }

    public function pagingRoles ($data) 
	{
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';

		$query = $this->with(['Menus'])
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

        $data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

    public function storeRoles ($data)
	{
		try {
			$this->create($data->except(['id']));

			return responseCreated('Thêm quyền thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showRoles ($id) 
	{
		return $this->with(['Menus'])->where('id', $id)->first();
	}

	public function updateRoles ($data, $id)
	{
		try {
			$role = $this->findOrFail ($id);

			$role->update($data->except(['id','created_at','updated_at']));

            return responseSuccess('Cập nhật quyền thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteRoles ($id)
	{
		try {
			$role = $this->findOrFail ($id);

			$role->delete();

            return responseSuccess('Xóa quyền thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}   
}
