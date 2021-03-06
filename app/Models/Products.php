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
                             
                        return responseCreated('Th??m ph??? t??ng th??nh c??ng!');   

                    } catch (\Throwable $th) {

                        $imageService->deleteFile($fileName, 'assets/img/uploads/products/');

                        return responseServerError('C?? l???i trong qu?? tr??nh th???c hi???n');
                    }     
                }

            } elseif ($imageService->checkFile($file) == 0){

                return responseServerError('File ???nh ph???i nh??? h??n 1MB');
            } else {

                return responseServerError('File kh??ng ph???i ???nh');
            }
        } else {

            return responseServerError('B???n ch??a ch???n ???nh cho ph??? t??ng');
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

                return responseServerError('File ???nh ph???i nh??? h??n 1MB');
            } else {

                return responseServerError('File kh??ng ph???i ???nh');
            }
        } else {

            $data['image'] = $product->image;
        }

		try {

			$product->update($data);

            return responseSuccess('C???p nh???t ph??? t??ng th??nh c??ng!');

		} catch (\Throwable $th) {

            $imageService->deleteFile($fileName, 'assets/img/uploads/products/');

			return responseServerError('C?? l???i trong qu?? tr??nh th???c hi???n');
		}
	}

	public function deleteProducts ($id, $imageService)
	{
		try {
			$product = $this->findOrFail ($id);

            $imageService->deleteFile($product->image);

			$product->delete();

            return responseSuccess('X??a ph??? t??ng th??nh c??ng!');

		} catch (\Throwable $th) {
            
			return responseServerError('C?? l???i trong qu?? tr??nh th???c hi???n');
		}
	}   
}
