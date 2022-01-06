<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Notifications\ResetPassword as ResetPasswordNotification;
use App\Custom\Hasher;
use App\Models\CustomRoles;
use App\Models\Menus;
use App\Models\Roles;
use Illuminate\Support\Facades\Hash;
use DB;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','phone','avatar','gender','address','salary','role_id','status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Custom attributes for data model.
     *
     * @var array
     */
    public $appends = ['hashid'];


    /**
     * Encodes the user id and returns the unique hash.
     *
     * @return string Hashid
     */
    public function hashid()
    {
        return Hasher::encode($this->id);
    }

    /**
     * Returns the hashid for a custom attribute.
     *
     * @return string Hashid
     */
    public function getHashidAttribute()
    {
        return $this->hashid();
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Allows us to customize the password notification email.
     * See: App/Notifications/ResetPassword.php
     *
     * @param string
     */
    public function sendPasswordResetNotification($token)
    {
        $email = $this->getEmailForPasswordReset();
        $user = $this::where('email', $email)->first();
        $this->notify(new ResetPasswordNotification($token, $user->id));
    }

    public function CustomRolesMenu () 
    {
        return $this->belongsToMany(Menus::class , 'custom_roles', 'user_id', 'menu_id')->selectRaw('*')->orderby('sort');
    }

    public function Roles () 
    {
        return $this->belongsTo(Roles::class , 'role_id');
    }

    public function pagingUsers ($data) 
    {
        $rows 			= $data->get('per_page');
		$search 		= $data->get('search');
		$fieldsearch 	= $data->get('fieldsearch');
		$val 			= '%'.$search.'%';

		$query = $this->join('roles', 'roles.id', 'users.role_id')
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

        $query->select('users.*', 'roles.name as name_role');

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;   
    }

    public function storeUsers ($request, $imageService)
    {
        if($request->hasFile('avatar')){

            $file = $request->avatar;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/users/');

                if($fileName !== 0) {

                    DB::beginTransaction();

                    try {

                        $data = $request->except(['id','roles','custom_roles']);

                        $data['avatar'] = 'assets/img/uploads/users/'.$fileName;
                        $data['password'] = Hash::make($data['password']);

                        $user = $this->create($data);

                        if ($request['roles'] == 'custom_role' && $request['custom_roles'] !== null) {
                            $custom_roles =  explode("," , $request['custom_roles']);
            
                            if (sizeof($custom_roles) > 0) {
                                $array = [];
                                foreach($custom_roles as $key => $custom_role) {
                                    array_push($array, ['menu_id' => $custom_role, 'user_id' => $user->id]);
                                }
                                CustomRoles::insert($array);
                            } else {
                                return responseServerError('Vui lòng chọn chức năng!');
                            }
                        }
                                
                        DB::commit();

                        return responseCreated('Thêm nhân viên thành công!');   

                    } catch (\Throwable $th) {

                        DB::rollback();

                        $imageService->deleteFile($fileName, 'assets/img/uploads/products/');

                        return responseServerError('Có lỗi trong quá trình thực hiện');
                    }     
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            return responseServerError('Bạn chưa chọn ảnh cho phụ tùng');
        }
    }

    public function getMenuUser ($id)
    {
        $custom_role = CustomRoles::where('user_id', $id)->first();

        if ($custom_role) {
            $data = $this->with(['CustomRolesMenu'])->where('id', $id)->first();
        } else {
            $user = $this->find($id);
            $data = Roles::with(['Menus'])->where('id', $user->role_id)->first();
        }

        return $data;
    }

    public function showUsers ($id) 
	{
        $custom_role = CustomRoles::where('user_id', $id)->first();

        if ($custom_role) {
            $data = $this->with(['CustomRolesMenu','Roles'])->where('id', $id)->first();
            $data['edit_roles'] = 'custom_role';
        } else {
            $data = $this->with(['Roles'])->where('id', $id)->first();
            $data['edit_roles'] = 'default_role';
        }

        $data['menus'] = Menus::orderBy('sort','ASC')->get();

        return $data;
	}

    public function updateUsers ($request, $id, $imageService) 
    {
        $user = $this->findOrFail ($id);

        $data = $request->except(['id','created_at','updated_at','_method','role_menus','hashid','edit_roles','password']);

       
        if($request->hasFile('avatar')){

            $file = $request->avatar;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/users/');

                if($fileName !== 0) {

                    if($fileName !== 0) {

                        $data['avatar'] = 'assets/img/uploads/users/'.$fileName;

                        $imageService->deleteFile($user->avatar);
                    }
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            $data['avatar'] = $user->avatar;
        }

        DB::beginTransaction();

        try {

            $userUpdate = $user->update($data);

            if ($request['edit_roles'] == 'custom_role' && $request['role_menus'] !== null) {
                $custom_roles =  explode("," , $request['role_menus']);

                if (sizeof($custom_roles) > 0) {
                    CustomRoles::where('user_id', $id)->delete();
                    $array = [];
                    foreach($custom_roles as $key => $custom_role) {
                        array_push($array, ['menu_id' => $custom_role, 'user_id' => $user->id]);
                    }
                    CustomRoles::insert($array);
                }
            } else {
                CustomRoles::where('user_id', $id)->delete();
            }
                    
            DB::commit();

            return responseSuccess('Cập nhật nhân viên thành công!');   

        } catch (\Throwable $th) {

            DB::rollback();

            return responseServerError('Có lỗi trong quá trình thực hiện');
        }   
    }

    public function deleteUsers ($id)
    {
        try {
			$user = $this->findOrFail ($id);
			
			$user->delete();

			return responseSuccess('Xóa nhân viên thành công!');

		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
    }

    public function getEmployeeTechnical () 
    {
        return $this->where('role_id', 3)->get();
    }

    public function updateInfo ($request, $id, $imageService) {

        $user = $this->findOrFail ($id);

        $data = $request->except(['_method']);
   
        if($request->hasFile('avatar')){

            $file = $request->avatar;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/users/');

                if($fileName !== 0) {

                    if($fileName !== 0) {

                        $data['avatar'] = 'assets/img/uploads/users/'.$fileName;

                        $imageService->deleteFile($user->avatar);
                    }
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            $data['avatar'] = $user->avatar;
        }

        try {

            $userUpdate = $user->update($data);

            return responseSuccessWithData('Cập nhật thông tin thành công!', $data['avatar']);   

        } catch (\Throwable $th) {

            return responseServerError('Có lỗi trong quá trình thực hiện');
        }  
    }
}
