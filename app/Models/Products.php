<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductTypes;
use App\Models\Suppliers;

class Products extends Model
{
    use HasFactory;

    protected $table = 'products';
	protected $guarded = array('id');

    protected $fillable = [
        'product_type_id',
        'supplier_id',
        'name',
        'quantity',
        'sold',
        'unit',
        'image',
        'description',
        'import_price',
        'price',
        'status'
	];

    public function ProductTypes ()
    {
        return $this->belongsto(ProductTypes::class, 'product_type_id');
    }

    public function Suppliers ()
    {
        return $this->belongsto(Suppliers::class, 'supplier_id');
    }

    public function pagingProducts ($data) 
	{
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';

		$query = $this->join('product_types', 'product_types.id', 'products.product_type_id')
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

        $query->select('products.*','product_types.name as name_product_type');

		$data = $rows ? $query->where('products.status', 'active')->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

    public function storeProducts ($request, $imageService)
	{
        if($request->hasFile('image')){

            $file = $request->image;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/products/');

                if($fileName !== 0) {

                    try {

                        $data = $request->except(['id']);

                        $data['image'] = 'assets/img/uploads/products/'.$fileName;
                        
                        $data['quantity'] = $data['quantity'] || 0;

                        $data['sold'] = $data['sold'] || 0;

                        $this->create($data);
                             
                        return responseCreated('Thêm phụ tùng thành công!');   

                    } catch (\Throwable $th) {

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

	public function showProducts ($id) 
	{
		return $this->with(['ProductTypes', 'Suppliers'])->where('id', $id)->first();
	}

	public function updateProducts ($request, $id,  $imageService)
	{
        $product = $this->findOrFail ($id);

        $data = $request->except(['id','created_at','updated_at','_method','sold']);

        if($request->hasFile('image')){

            $file = $request->image;

            if($imageService->checkFile($file) == 1) {

                $fileName = $imageService->moveImage($file,'assets/img/uploads/products/');

                if($fileName !== 0) {

                    $data['image'] = 'assets/img/uploads/products/'.$fileName;

                    $imageService->deleteFile($product->image);
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ảnh phải nhỏ hơn 1MB');
            } else {

                return responseServerError('File không phải ảnh');
            }
        } else {

            $data['image'] = $product->image;
        }

		try {

			$product->update($data);

            return responseSuccess('Cập nhật phụ tùng thành công!');

		} catch (\Throwable $th) {

            $imageService->deleteFile($fileName, 'assets/img/uploads/products/');

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteProducts ($id, $imageService)
	{
		try {
			$product = $this->findOrFail ($id);

            $imageService->deleteFile($product->image);

			$product->delete();

            return responseSuccess('Xóa phụ tùng thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}   
}
