<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CustomerTypes;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;


class Customers extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'customers';
	protected $guarded = array('id');

    protected $fillable = [
        'customer_type_id',
        'name',
        'address',
        'email',
        'phone',
		'avatar',
		'password',
        'gender',
        'tax_code',
        'account_number',
        'bank_name',
        'owed',
        'status'
	];

	protected $hidden = [
        'password',
    ];

    public function CustomerTypes () 
    {
        return $this->belongsto(CustomerTypes::class , 'customer_type_id')->select(['id','name']);
    }

	public function getJWTIdentifier()
    {
        return $this->getKey();
    }

	public function getJWTCustomClaims()
    {
        return [];
    }


    public function pagingCustomers ($data) 
    {
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';

		$query = $this->join('customer_types', 'customer_types.id', 'customers.customer_type_id')
		->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

		$query->select('customers.*','customer_types.name as name_cus_type');
		
		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
    }

	public function storeCustomers ($data)
	{
		try {
			$this->create($data->except(['id']));

            return responseCreated('Thêm khách thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showCustomers ($id) 
	{
		return $this->with(['CustomerTypes'])->where ('id',$id)->first();
	}

	public function updateCustomers ($data, $id)
	{
		try {
			$customer = $this->findOrFail ($id);

			$customer->update($data->except(['id','created_at','updated_at']));

			return responseSuccess('Cập nhật khách hàng thành công!');

		} catch (\Throwable $th) {

            return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteCustomers ($id)
	{
		try {
			$customer = $this->findOrFail ($id);
            
			$customer->delete();

            return responseSuccess('Xóa khách hàng thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function register ($data) 
	{
		try {
			$checkPhone = $this->where('phone', $data['phone'])->first();

			if (!$checkPhone) {
				$data['customer_type_id'] = isset($data['customer_type_id']) ? $data['customer_type_id'] : "1";
				$data['password'] = Hash::make($data['password']);
				
				$this->create($data->except(['re_password']));

				return responseCreated('Đăng ký thành công!');

			} else {
				return responseServerError('Số điện thoại đã được đăng ký!');
			}

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function login ($data) {
		$customer = $this->where('phone', $data['phone'])->first();

		if ($customer) {

			if (isset($customer->password)) {

				if (! $token = auth()->guard('customers')->attempt($data)) {
					return responseUnauthorized();
				}
				$user = auth()->guard('customers')->user();
				return response()->json([
					'status' => 200,
					'message' => 'Authorized.',
					'access_token' => $token,
					'token_type' => 'bearer',
					'expires_in' => auth()->factory()->getTTL() * 60,
					'user' => array(
						'id' => $user->id,
						'name' => $user->name,
						'phone' => $user->phone,
						'avatar' => $user->avatar
					)
				], 200);

			} else {
				return responseServerError('Số điện thoại chưa cập nhật mật khẩu!'); 
			}
		} else {
			return responseServerError('Số điện thoại chưa đăng ký!'); 
		}
	
	}

	public function userProfile () {
		$id = auth()->guard('customers')->id();
		if ($id) {
			return $this->findOrFail ($id);
		} else {
			return responseServerError('Vui lòng đăng nhập!');
		}
	}

	public function updateUserProfile ($request, $id , $imageService) {
	
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

	public function resetPassword ($data) {
		$customer = $this->where('phone',$data['phone'])->first();

		if ($customer) {
			$dataUpdate = [
				'password'=>  Hash::make($data['password']),
			];

			$customer->update($dataUpdate);

			return responseSuccess('Cập nhật mật khẩu thành công!');
		} else {
			return responseServerError('Không tìm thấy tài khoản!');
		}
	}

	public function changePass ($request) {
		try {
			$id = auth()->guard('customers')->id();
			$customer = $this->find($id);
			if (Hash::check($request->password, $customer->password)) {
				$customer->update(['password' => Hash::make($request->new_password)]);
				return responseSuccess('Đổi mật khẩu thành công!');
			} else {
				return responseServerError('Mật khẩu không đúng!');
			}
		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện!');
		}
	}
}
