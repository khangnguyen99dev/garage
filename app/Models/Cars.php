<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customers;
use App\Models\CarBrands;
use App\Models\ReceiveVotes;

class Cars extends Model
{
    use HasFactory;

    protected $table = 'cars';

    protected $primaryKey = 'number_car';

    public $incrementing = false;

    protected $fillable = [
		'number_car',
        'customer_id',
        'car_brand_id',
        'made_year',
        'frame_number',
        'color',
        'machine_number',
        'province',
        'description',
        'mantain_count'
	];

    public function Customers ()
    {
        return $this->belongsto(Customers::class, 'customer_id');
    }

    public function CarBrands ()
    {
        return $this->belongsto(CarBrands::class, 'car_brand_id');
    }

    public function pagingCars ($data) 
	{
		$rows 			    = $data->get('per_page');
		$search 		    = $data->get('search');
		$fieldsearch 	    = $data->get('fieldsearch');
		$val 			    = '%'.$search.'%';

		$query = $this->join('customers','customers.id','cars.customer_id')
        ->join('car_brands','car_brands.id','cars.car_brand_id')
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

		$query->select('cars.*', 'customers.name as name_customer', 'car_brands.name as name_car_brand');

		$data = $rows ? $query->orderBy('sort','DESC')->paginate($rows) : $query->orderBy('sort','DESC')->get();

		return $data;
	}

	public function showCars ($id) 
	{
		return $this->with(['Customers', 'CarBrands'])->where ('number_car',$id)->first();
	}

	public function storeCars ($data)
	{
		try {
			$checkNumber = $this->find($data['number_car']);

			if (!$checkNumber) {

				$car = $this->create($data->toArray());

				return responseCreated('Thêm xe thành công!');

			} else {
				return responseServerError('Biển số xe đã tồn tại!');
			}

		} catch (\Throwable $th) {
			
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}

	}

	public function updateCars ($data, $id) 
	{
		try {
			$car = $this->findOrFail ($id);

			$car->update($data->except(['created_at','updated_at']));

			return responseSuccess('Cập nhật xe thành công!');
		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteCars ($id)
	{
		try {
			$check = ReceiveVotes::where('number_car_id', $id)->first();
			if (!$check) {
				$car = $this->findOrFail ($id);

				$car->delete();
	
				return responseSuccess('Xóa xe thành công!');
			} else {
				return responseServerError('Xe trong quá trình xử lý, không thể xóa!');
			}
		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function getCars ($data) 
	{
		$id = auth()->guard('customers')->id();

		if ($id) {
			$rows 			    = $data->get('per_page');
			$search 		    = $data->get('search');
			$fieldsearch 	    = $data->get('fieldsearch');
			$val 			    = '%'.$search.'%';
	
			$query = $this->join('customers','customers.id','cars.customer_id')
			->join('car_brands','car_brands.id','cars.car_brand_id')
			->where(function ($query) use ($val, $fieldsearch) {
				if ($fieldsearch) {
					$query = getQueryLike($query,$fieldsearch,$val);
				}
			});
	
			$data = $query->where('customers.id', $id)->select('cars.*', 'car_brands.name as name_car_brand')->orderBy('sort','DESC')->get();
	
			return $data;
		} else {
			return responseServerError('Vui lòng đăng nhập!');
		}
	}

	public function storeCarsClient ($data)
	{
		try {
			$checkNumber = $this->find($data['number_car']);
			if (!$checkNumber) {
				$data['customer_id'] = auth()->guard('customers')->id();

				$car = $this->create($data->toArray());
	
				return responseCreated('Thêm xe thành công!');
			} else {
				return responseServerError('Biển số xe đã tồn tại!');
			}
		} catch (\Throwable $th) {
			
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}
}
