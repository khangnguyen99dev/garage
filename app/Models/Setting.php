<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $table = 'setting_info';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'name_represent',
        'email',
        'phone',
        'website',
        'address',
        'logo',
        'content',
        'account_number',
        'name_bank'
	];

    public function updateBusinessInfo ($request, $id, $imageService) {
        $setting = $this->findOrFail ($id);

        $data = $request->except(['id']);

        if($request->hasFile('logo')){

            $file = $request->logo;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/settings/');

                if($fileName !== 0) {

                    $data['logo'] = 'assets/img/uploads/settings/'.$fileName;

                    $imageService->deleteFile($setting->logo);
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            $data['logo'] = $setting->logo;
        }

		try {

			$setting->update($data);

            return responseSuccess('Cập nhật thông tin thành công!');

		} catch (\Throwable $th) {

            $imageService->deleteFile($fileName, 'assets/img/uploads/settings/');

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
    }
}
