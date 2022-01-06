<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ImportVoteDetails;
use App\Models\Suppliers;
use App\Models\User;
use App\Models\Products;
use DB;
use Carbon\Carbon;

class ImportVotes extends Model
{
    use HasFactory;

    protected $table = 'import_votes';
	protected $guarded = array('id');

    protected $fillable = [
        'supplier_id',
        'user_id',
		'import_code',
        'import_date',
        'vote_date',
		'image_auth',
        'total_price',
        'payment',
        'note',
		'status'
	];

	public function Suppliers ()
    {
        return $this->belongsto(Suppliers::class, 'supplier_id')->select(['id','name']);
    }

	public function Users ()
    {
        return $this->belongsto(User::class, 'user_id')->select(['id','name']);
    }

    public function Products () 
    {
        return $this->belongsToMany(Products::class , 'import_vote_details', 'import_vote_id', 'product_id')->withPivot('price','import_price','quantity','id');
    }

    public function pagingImportVotes ($data) 
	{
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';
		$fillterDate    = $data->get('fillterDate');

		$query = $this->join('suppliers', 'suppliers.id', 'import_votes.supplier_id')
		->join('users', 'users.id', 'import_votes.user_id')
		->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

		$query->select('import_votes.*', 'suppliers.name as name_supplier', 'users.name as name_emp');
		
		if ($fillterDate) {
			$date 	=  explode(",",$fillterDate);
			$start 	= Carbon::parse($date[0]);
			$end 	= Carbon::parse($date[1])->modify('23:59:00');

			$query->whereBetween('import_votes.vote_date', [$start, $end]);
		}

        $data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

	public function storeImportVotes ($data, $imageService)
	{
		DB::beginTransaction();
		try {
			if($data->hasFile('image')){

				$file = $data->image;
	
				if($imageService->checkFile($file) == 1) {
	
					$fileName = $imageService->moveImage($file,'assets/img/uploads/imports/');
	
					if($fileName !== 0) {
						$data['image_auth'] = 'assets/img/uploads/imports/'.$fileName;
					}
	
				} elseif ($imageService->checkFile($file) == 0){
	
					return responseServerError('File ảnh phải nhỏ hơn 1MB');
				} else {
	
					return responseServerError('File không phải ảnh');
				}
			} 

			$data['import_code'] 	= strtoupper(uniqid());
			$data['user_id'] 		= auth()->id();

			$importVote = $this->create($data->except(['products','image']));

			if ($importVote) {
                $products = json_decode($data->products,true);
                if (sizeof($products) > 0) {
                    foreach($products as $key => $product) {
                        $products[$key]['import_vote_id'] = $importVote->id;
                        unset($products[$key]['name']);
						if (isset($products[$key]['id'])) {
							unset($products[$key]['id']);
						}
                    }
                    ImportVoteDetails::insert($products);
                }
            }

			DB::commit();
			return responseCreated('Thêm phiếu nhập hàng thành công!');

		} catch (\Throwable $th) {
			DB::rollback();

			$imageService->deleteFile($fileName, 'assets/img/uploads/imports/');

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function confirmImportVotes ($id)
	{
		DB::beginTransaction();
		try {
			$importVote = $this->find($id);
			$importVote->update([
				'status'=>"1",
			]);

			DB::commit();
			return responseSuccess('Xác nhận nhập hàng thành công!');

		} catch (\Throwable $th) {
			DB::rollback();
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function showImportVotes ($id)
	{
		$data = $this->with(['Suppliers','Users','Products'])->where('id', $id)->first();
		$data['vote_date'] = getDateAttribute($data['vote_date']);
		$data['import_date'] = getDateAttribute($data['import_date']);
		return $data;
	}

	public function updateImportVotes ($data, $id, $imageService)
	{
		DB::beginTransaction();
        try {
			$importVote = $this->findOrFail ($id);

			if($data->hasFile('image')){

				$file = $data->image;
	
				if($imageService->checkFile($file) == 1) {
	
					$fileName = $imageService->moveImage($file,'assets/img/uploads/imports/');
	
					if($fileName !== 0) {
	
						$data['image_auth'] = 'assets/img/uploads/imports/'.$fileName;
	
						$imageService->deleteFile($importVote->image_auth);
					}
	
				} elseif ($imageService->checkFile($file) == 0){
	
					return responseServerError('File ảnh phải nhỏ hơn 1MB');
				} else {
	
					return responseServerError('File không phải ảnh');
				}
			} else {
	
				$data['image_auth'] = $importVote->image_auth;
			}

			$importVote->update($data->except(['id','products','image']));

            $products = json_decode($data->products,true);

            if (sizeof($products) > 0) {
                foreach($products as $key => $product) {
                    $products[$key]['import_vote_id'] = $importVote->id;
                    unset($products[$key]['name']);
                }

                $idProducts = array_column($products, 'product_id');

                ImportVoteDetails::where('import_vote_id', $importVote->id)->whereNotIn('product_id',$idProducts)->delete();
                
                foreach ($products as $product) {
                    if(!isset($product['id']) || (isset($product['id']) && $product['id']=='')){
                        $product['import_vote_id'] = $importVote->id;
                        ImportVoteDetails::insert($product);
                    }else{
                        $updateimportVote = ImportVoteDetails::where('id',$product['id']);
                        $updateimportVote->update($product);
                    }
                } 
            } else {
                ImportVoteDetails::where('import_vote_id', $importVote->id)->delete();
            }

            DB::commit();

            return responseSuccess('Cập nhật phiếu nhập hàng thành công!');

		} catch (\Throwable $th) {

            DB::rollback();

			$imageService->deleteFile($fileName, 'assets/img/uploads/imports/');

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}	
	}

	public function deleteImportVotes ($id)
	{
		try {
			$importVote = $this->findOrFail ($id);

			$importVote->delete();

			return responseSuccess('Xóa phiếu nhập hàng thành công!');

		} catch (\Throwable $th) {
			
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function supplierPayment ($id) {
		$data = $this->with('Suppliers')->where('id', $id)->first();
		$data['import_date'] =  getDateAttribute($data['receive_date']);
		return $data;
	}

	public function showSupplierPayment ($id) {
		return $this->join('suppliers','suppliers.id','import_votes.supplier_id')
					->join('users','users.id','import_votes.user_id')
					->where('suppliers.id',$id)
					->select('import_votes.*','users.name as employee')
					->get();
	}
}
