<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ServiceTypes;

class Services extends Model
{
    use HasFactory;

    protected $table = 'services';
	protected $guarded = array('id');

    protected $fillable = [
        'name',
        'slug',
		'service_type_id',
		'image',
        'price',
        'description',
        'content',
        'status'
	];

	public function ServiceTypes () {
		return $this->belongsTo (ServiceTypes::class, 'service_type_id')->select(['id','name']);
	}

    public function pagingServices($data) 
	{
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';

		$query = $this->join('service_types', 'service_types.id', 'services.service_type_id')
		->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

		$query->select('services.*','service_types.name as name_service_type');

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

    public function getServices ($data) 
	{
        return $this->where('status', 'active')->get();
	}

	public function storeServices($request, $imageService)
	{
		if($request->hasFile('image')){

            $file = $request->image;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/services/');

                if($fileName !== 0) {

                    try {

                        $data = $request->except(['id']);

                        $data['image'] = 'assets/img/uploads/services/'.$fileName;

                        $data['slug'] = utf8tourl($request->name);
                        
                        $this->create($data);
                             
                        return responseCreated('Thêm dịch vụ thành công!');

                    } catch (\Throwable $th) {

                        $imageService->deleteFile($fileName, 'assets/img/uploads/services/');

                        return responseServerError('Có lỗi trong quá trình thực hiện');
                    }     
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            return responseServerError('Bạn chưa chọn ảnh cho dịch vụ');
        }
	}

	public function showServices($id) 
	{
		return $this->with('ServiceTypes')->where('id', $id)->first();
	}

	public function updateServices($request, $id, $imageService)
	{
		$service = $this->findOrFail ($id);

        $data = $request->except(['id','created_at','updated_at','service_types']);

        if($request->hasFile('image')){

            $file = $request->image;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/services/');

                if($fileName !== 0) {

                    $data['image'] = 'assets/img/uploads/services/'.$fileName;

                    $imageService->deleteFile($service->image);
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            $data['image'] = $service->image;
        }

		try {

            $data['slug'] = utf8tourl($request->name);

			$service->update($data);

            return responseSuccess('Cập nhật dịch vụ hàng thành công!');

		} catch (\Throwable $th) {

            $imageService->deleteFile($fileName, 'assets/img/uploads/services/');

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteServices($id)
	{
		try {
			$service = $this->findOrFail ($id);

			$service->delete();

            return responseSuccess('Xóa dịch vụ hàng thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}
}
