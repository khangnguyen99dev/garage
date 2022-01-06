<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\RepairServiceDetails;
use App\Models\RepairVoteDetails;
use App\Models\ReceiveVotes;
use App\Models\Services;
use App\Models\Products;
use App\Models\User;
use App\Models\Cars;
use App\Models\FeedBacks;
use Carbon\Carbon;
use DB;

class RepairVotes extends Model
{
    use HasFactory;

    protected $table = 'repair_votes';
	protected $guarded = array('id','receive_vote_id');
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'user_id',
        'receive_vote_id',
        'repair_date',
        'expecte_date',
        'discount',
        'total_price',
        'paymented',
        'status',	
	];

    public function Services () 
    {
        return $this->belongsToMany(Services::class , 'repair_service_details', 'repair_vote_id', 'service_id')->withPivot('price','note','id');
    }

    public function Products () 
    {
        return $this->belongsToMany(Products::class , 'repair_vote_details', 'repair_vote_id', 'product_id')->withPivot('quantity','price','id');
    }

    public function Users () 
    {
        return $this->belongsTo (User::class, 'user_id')->select(['id','name']);
    }

    public function ReceiveVotes () 
    {
        return $this->belongsTo (ReceiveVotes::class, 'receive_vote_id')->select(['id','number_car_id']);
    }

    public function UserCollects () 
    {
        return $this->belongsToMany (User::class, 'collect_votes', 'repair_vote_id', 'user_id')->withPivot('collect_date','money','id');
    }

    public function FeedBacks () {
        return $this->hasOne(FeedBacks::class, 'repair_vote_id');
    }

    public function pagingRepairVotes ($data) 
	{
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';
        $fillterDate    = $data->get('fillterDate');
        $status			= $data->get('status');

		$query = $this->join('users', 'users.id', 'repair_votes.user_id')
        ->join('receive_votes', 'receive_votes.id' ,'repair_votes.receive_vote_id')
        ->leftJoin('cars', 'cars.number_car' ,'receive_votes.number_car_id')
        ->leftJoin('customers', 'customers.id', 'cars.customer_id')
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

        if ($fillterDate) {
			$date   = explode(",",$fillterDate);
			$start  = Carbon::parse($date[0]);
			$end    = Carbon::parse($date[1])->modify('23:59:00');

			$query->whereBetween('repair_votes.repair_date', [$start, $end]);
		}

        if (isset($status)) {
			$query->where('repair_votes.status', $status);
		}

        $query->select('repair_votes.*','receive_votes.number_car_id', 'cars.customer_id', 'customers.name as name_cus', 'users.name as name_emp');

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

    public function storeRepairVotes ($data)
    {
        DB::beginTransaction();

        try {
            $repairVote = $this->create($data->except(['products','services']));

            if ($repairVote) {
                $services = $data->services;
                if (sizeof($services) > 0) {
                    foreach($services as $key => $service) {
                        $services[$key]['repair_vote_id'] = $repairVote->id;
                        unset($services[$key]['name']);
                        if (!isset($services[$key]['note'])) {
                            $services[$key]['note'] = '';
                        }
                        if(array_key_exists('id',$services[$key])) {
                            unset($services[$key]['id']);
                        }
                    }
                    RepairServiceDetails::insert($services);
                }

                $products = $data->products;
                if (sizeof($products) > 0) {
                    foreach($products as $key => $product) {
                        $products[$key]['repair_vote_id'] = $repairVote->id;
                        unset($products[$key]['name']);
                        if(array_key_exists('id',$products[$key])) {
                            unset($products[$key]['id']);
                        }
                    }
                    RepairVoteDetails::insert($products);
                }
            }

            $receiveVote = ReceiveVotes::find($repairVote->receive_vote_id);
            $receiveVote->status = "2";
            $receiveVote->save();

            DB::commit();
			return responseCreated('Lập báo giá thành công!');

        } catch (\Throwable $th) {

            DB::rollback();
            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }

    public function showRepairVotes ($id)
    {        
        $data = $this->with(['Services','Products','Users'])
        ->join('receive_votes', 'receive_votes.id' ,'repair_votes.receive_vote_id')
        ->where('receive_vote_id', $id)
        ->select('repair_votes.*','receive_votes.number_car_id', 'receive_votes.require')
        ->first();
        
        $data['cars'] = Cars::with(['Customers', 'CarBrands'])->where ('number_car',$data->number_car_id)->first();
		$data['receive_date']   = getDateAttribute($data['receive_date']);
        $data['repair_date']    = getDateAttribute($data['repair_date']);
        $data['expecte_date']    = getDateAttribute($data['expecte_date']);
        return $data;
    }
    
    public function updateRepairVotes ($data, $id) 
    {
        DB::beginTransaction();
        try {
			$repairVote = $this->findOrFail ($id);

			$repairVote->update($data->except(['id','created_at','updated_at','products','services']));

            $services = $data->services;

            if (sizeof($services) > 0) {
                foreach($services as $key => $service) {
                    $services[$key]['repair_vote_id'] = $repairVote->id;
                    unset($services[$key]['name']);
                    if (!isset($services[$key]['note'])) {
                        $services[$key]['note'] = '';
                    }
                }

                $idServices = array_column($services, 'service_id');

                RepairServiceDetails::where('repair_vote_id', $repairVote->id)->whereNotIn('service_id',$idServices)->delete();
                
                foreach ($services as $service) {
                    if(!isset($service['id']) || (isset($service['id']) && $service['id']=='')){
                        $service['repair_vote_id'] = $repairVote->id;
                        RepairServiceDetails::insert($service);
                    }else{
                        $updateRepairVote =  RepairServiceDetails::where('id',$service['id']);
                        $updateRepairVote->update($service);
                    }
                } 
            } else {
                RepairServiceDetails::where('repair_vote_id', $repairVote->id)->delete();
            }

            $products = $data->products;

            if (sizeof($products) > 0) {
                foreach($products as $key => $product) {
                    $products[$key]['repair_vote_id'] = $repairVote->id;
                    unset($products[$key]['name']);
                }

                $idProducts = array_column($products, 'product_id');

                RepairVoteDetails::where('repair_vote_id', $repairVote->id)->whereNotIn('product_id',$idProducts)->delete();
                
                foreach ($products as $product) {
                    if(!isset($product['id']) || (isset($product['id']) && $product['id']=='')){
                        $product['repair_vote_id'] = $repairVote->id;
                        RepairVoteDetails::insert($product);
                    }else{
                        $updateRepairVote = RepairVoteDetails::where('id',$product['id']);
                        $updateRepairVote->update($product);
                    }
                } 
            } else {
                RepairVoteDetails::where('repair_vote_id', $repairVote->id)->delete();
            }

            DB::commit();

            return responseSuccess('Cập nhật phiếu sửa chữa thành công!');

		} catch (\Throwable $th) {

            DB::rollback();

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
    }

    public function deleteRepairVotes ($id) 
    {
        try {
			$repairVote = $this->where ('receive_vote_id',$id)->first();

			$repairVote->delete();

            $receiveVote = ReceiveVotes::find($id);
            $receiveVote->status = "1";
            $receiveVote->save();

            return responseSuccess('Xóa phiếu sửa chữa thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
    }

    public function acceptRepair ($id) 
    {
        try {
            $repairVote = $this->find($id);

            $repairVote->update([
                'status' => "3"
            ]);

            return responseSuccess('Xác nhận sửa chữa thành công!');            
        } catch (\Throwable $th) {

            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }

    public function showCollectVote ($id)
    {
        return $this->with(['UserCollects'])->where('id', $id)->first();
    }

    public function customerPaymentRepair ($idCus) 
    {
        return $this->join('receive_votes', 'receive_votes.id', 'repair_votes.receive_vote_id')
        ->join('users', 'users.id', 'repair_votes.user_id')
        ->leftJoin('cars', 'cars.number_car' ,'receive_votes.number_car_id')
        ->leftJoin('customers', 'customers.id', 'cars.customer_id')
        ->select('repair_votes.*','cars.number_car', 'users.name')
        ->where('customers.id', $idCus)
        ->where(function ($query)  {
            $query
            ->orWhere('repair_votes.status', "3")
            ->orWhere('repair_votes.status', "4")
            ->orWhere('repair_votes.status', "5");
		})->get();
    }

    public function getHistoryRepairs ()
    {
        $id = auth()->guard('customers')->id();

        if ($id) {
            return $this->with('FeedBacks')
                        ->join('receive_votes', 'receive_votes.id', 'repair_votes.receive_vote_id')
                        ->join('users', 'users.id', 'repair_votes.user_id')
                        ->leftJoin('cars', 'cars.number_car' ,'receive_votes.number_car_id')
                        ->leftJoin('customers', 'customers.id', 'cars.customer_id')
                        ->select('repair_votes.*','cars.number_car', 'users.name')
                        ->where('customers.id', $id)
                        ->where(function ($query)  {
                            $query
                            ->orWhere('repair_votes.status', "4")
                            ->orWhere('repair_votes.status', "5");
                        })->get();
        } else {
            return responseServerError('Vui lòng đăng nhập!');
        }
    }

    public function getFeedback ($id) 
    {
        try {
            $id_cus = $this->join('receive_votes', 'receive_votes.id', 'repair_votes.receive_vote_id')
                    ->leftJoin('cars', 'cars.number_car' ,'receive_votes.number_car_id')
                    ->leftJoin('customers', 'customers.id', 'cars.customer_id')
                    ->where('repair_votes.id', $id)
                    ->value('customers.id');
        

            
            if ($id_cus == auth()->guard('customers')->id()) {
                $data = $this->join('receive_votes', 'receive_votes.id', 'repair_votes.receive_vote_id')
                            ->join('users','users.id','repair_votes.user_id')
                            ->leftJoin('cars', 'cars.number_car' ,'receive_votes.number_car_id')
                            ->leftJoin('customers', 'customers.id', 'cars.customer_id')
                            ->where('repair_votes.id', $id)
                            ->select('repair_votes.*','cars.number_car','users.name as name_employee')
                            ->first();
                $data['repair_date'] = getDateAttribute($data['repair_date']);

                return $data;
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            return false;
        }
    }

}
