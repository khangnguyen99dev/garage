<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $table = 'news';
	protected $guarded = array('id');

    protected $fillable = [
        'user_id',
        'name',
		'slug',
		'image',
        'description',
        'content',
        'status'
	];


    public function pagingNews ($data) 
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

        $data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->where('status','active')->orderBy('id','DESC')->get();

		return $data;
	}

    public function storeNews ($request, $imageService)
	{

		if($request->hasFile('image')){

            $file = $request->image;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/news/');

                if($fileName !== 0) {

                    try {

                        $data = $request->except(['id']);

						$data['slug'] = utf8tourl($request->name);

                        $data['user_id'] = auth()->id();

                        $data['image'] = 'assets/img/uploads/news/'.$fileName;
                        
                        $this->create($data);
                             
                        return responseCreated('Thêm tin tức thành công!');

                    } catch (\Throwable $th) {

                        $imageService->deleteFile($fileName, 'assets/img/uploads/news/');

                        return responseServerError('Có lỗi trong quá trình thực hiện');
                    }     
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            return responseServerError('Bạn chưa chọn ảnh cho tin tức');
        }
	}

	public function showNews ($id) 
	{
		return $this->find($id);
	}

	public function updateNews ($request, $id, $imageService)
	{
		$new = $this->findOrFail ($id);

        $data = $request->except(['id','created_at','updated_at']);

        if($request->hasFile('image')){

            $file = $request->image;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/news/');

                if($fileName !== 0) {

                    $data['image'] = 'assets/img/uploads/news/'.$fileName;

                    $imageService->deleteFile($new->image);
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            $data['image'] = $new->image;
        }

		try {

			$data['slug'] = utf8tourl($request->name);

			$new->update($data);

            return responseSuccess('Cập nhật tin tức hàng thành công!');

		} catch (\Throwable $th) {

            $imageService->deleteFile($fileName, 'assets/img/uploads/news/');

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteNews ($id)
	{
		try {
			$role = $this->findOrFail ($id);

			$role->delete();

            return responseSuccess('Xóa tin tức thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}   
}
