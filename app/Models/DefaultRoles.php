<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
class DefaultRoles extends Model
{
    use HasFactory;

    protected $table = 'default_roles';
	protected $guarded = array('id');

    protected $fillable = [
        'role_id',
        'menu_id'
	];


    public function storeDefaultRoles ($data) 
    {
        DB::beginTransaction();
        try {
            $id = intval($data['id']);

            $defauleRoles = $data['roles'];

            if (sizeof($defauleRoles) > 0) {
                $array = [];
                foreach($defauleRoles as $key => $defauleRole) {
                    array_push($array, ['menu_id' => $defauleRole, 'role_id' => $id]);
                }
                $this->insert($array);
            } else {
                return responseServerError('Vui lòng chọn chức năng!');
            }

            DB::commit();
            return responseCreated('Thiết lập quyền thành công!');

        } catch (\Throwable $th) {
            DB::rollback();
            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }

    public function updateDefaultRoles ($data,$id)
    {
        DB::beginTransaction();
        try {
            $id = intval($data['id']);
            $defauleRoles = $data['roles'];

            if (sizeof($defauleRoles) > 0) {
                $this->where('role_id', $id)->delete();
                $array = [];
                foreach($defauleRoles as $key => $defauleRole) {
                    array_push($array, ['menu_id' => $defauleRole, 'role_id' => $id]);
                }
                $this->insert($array);
            } else {
                $this->where('role_id', $id)->delete();
            }
            DB::commit();
            return responseSuccess('Cập nhật thành công!');
        } catch (\Throwable $th) {
            DB::rollback();
            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }
}
