<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cars;
use Auth;
use Carbon\Carbon;
use Twilio\Rest\Client; 

class ReceiveVotes extends Model
{
    use HasFactory;

    protected $table = 'receive_votes';
	protected $guarded = array('id');
	protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'number_car_id',
        'receive_date',
        'car_condition',
        'note',
		'repair_date',
        'km_into',
        'require',
        'status',		
	];

    public function pagingReceiveVotes ($data) 
	{
		$rows 			    = $data->get('per_page');
		$search 		    = $data->get('search');
		$fieldsearch 	    = $data->get('fieldsearch');
		$val 			    = '%'.$search.'%';
		$fillterDate		= $data->get('fillterDate');
		$status				= $data->get('status');


		$query = $this->join('cars','cars.number_car','receive_votes.number_car_id')
        ->leftJoin('customers','customers.id','cars.customer_id')
        ->join('users','users.id','receive_votes.user_id')
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		})
		->where('receive_votes.status','!=',"0");

		if ($fillterDate) {
			$date 	=  explode(",",$fillterDate);
			$start 	= Carbon::parse($date[0]);
			$end 	= Carbon::parse($date[1])->modify('23:59:00');

			$query->whereBetween('receive_date', [$start, $end]);
		}

		if (isset($status)) {
			$query->where('receive_votes.status', $status);
		}

		$query->select('receive_votes.*', 'cars.number_car', 'users.name as name_emp','customers.name as name_cus');

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
	}

	public function showReceiveVotes ($id) 
	{
		$data = $this->findOrFail ($id);
		$data['cars'] = Cars::with(['Customers', 'CarBrands'])->where ('number_car',$data->number_car_id)->first();
		$data['receive_date'] = $data['receive_date'] == null ? '' : $this->getDateAttribute($data['receive_date']);
		$data['repair_date'] = $this->getDateAttribute($data['repair_date']);
		return $data;
	}

	public function getDateAttribute($value)
	{
    	return Carbon::parse($value)->format('Y-m-d\TH:i');
	}

    public function storeReceiveVotes ($data)
	{
		try {
            $data['user_id'] = Auth::id();
			$this->create($data->except(['id']));

			return responseCreated('Tạo phiếu tiếp nhận thành công!');

		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function updateReceiveVotes ($data, $id)
	{
		try {
			$receiveVote = $this->findOrFail ($id);


			$receiveVote->update($data->except(['id','created_at','updated_at']));

            return responseSuccess('Cập nhật phiếu tiếp nhận thành công!');

		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function deleteReceiveVotes ($id) 
	{
		try {
			$receiveVote = $this->findOrFail ($id);

			$receiveVote->delete();

            return responseSuccess('Xóa phiếu tiếp nhận thành công!');

		} catch (\Throwable $th) {
            
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function bookings ($data) 
	{
		try {
			$this->create($data->toArray());
			return responseCreated('Đăng ký thành công!');
		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function pagingBookings ($data) {
		$rows 			    = $data->get('per_page');
		$search 		    = $data->get('search');
		$fieldsearch 	    = $data->get('fieldsearch');
		$val 			    = '%'.$search.'%';
		$fillterDate		= $data->get('fillterDate');

		$query = $this->join('cars','cars.number_car','receive_votes.number_car_id')
        ->leftJoin('customers','customers.id','cars.customer_id')
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		})
		->where('receive_votes.status','=',"0");

		if ($fillterDate) {
			$date 	=  explode(",",$fillterDate);
			$start 	= Carbon::parse($date[0]);
			$end 	= Carbon::parse($date[1])->modify('23:59:00');

			$query->whereBetween('repair_date', [$start, $end]);
		}

		$query->select('receive_votes.*', 'cars.number_car','customers.name as name_cus');

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;	
	}

	public function acceptReceiveVote ($data, $id) {
		// +13073170142 phone send sms

		try {
			if ($data->send_sms) {

				$phone = 	$this->join('cars','cars.number_car','receive_votes.number_car_id')
							->join('customers','customers.id','cars.customer_id')
							->where('receive_votes.id',$id)
							->pluck('phone');
	
	
				$sid    = env('TWilIO_SID'); 
				$token  = env('TWilIO_TOKEN'); 
		
				$twilio = new Client($sid, $token); 
				 
				$message = $twilio->messages 
								  ->create("+84".substr($phone[0],1), 
										   array(  
											   "messagingServiceSid" => env('MESSAGE_SID'),      
											   "body" =>  "GARAGE AN KHANG - Yêu cầu sửa chữa của bạn đã được duyệt!"
										   ) 
								  ); 
			}
			
			$receiveVote = $this->find($id);

			$data['user_id'] = auth()->id();

			$data['status'] = "1";

			$receiveVote->update($data->toArray());

			return responseSuccess('Xác nhận thành công!'); 
		} catch (\Throwable $th) {

			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function cancelReceiveVote ($data, $id) {
		
		try {

			if ($data->send_sms) {

				$phone = 	$this->join('cars','cars.number_car','receive_votes.number_car_id')
							->join('customers','customers.id','cars.customer_id')
							->where('receive_votes.id',$id)
							->pluck('phone');
	
	
				$sid    = env('TWilIO_SID'); 
				$token  = env('TWilIO_TOKEN'); 
		
				$twilio = new Client($sid, $token); 
				 
				$message = $twilio->messages 
								  ->create("+84".substr($phone[0],1), 
										   array(  
											   "messagingServiceSid" => env('MESSAGE_SID'),      
											   "body" =>  "GARAGE AN KHANG - Hủy yêu cầu sửa chữa, lý do: ".$data->note
										   ) 
								  ); 
			}

			$receiveVote = $this->find($id);

			$data['user_id'] = auth()->id();

			$data['status'] = "4";

			$receiveVote->update($data->except(['id']));

			return responseSuccess('Huỷ yêu cầu thành công!'); 
		} catch (\Throwable $th) {
			
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
	}

	public function bookingRepair () {
        $id = auth()->guard('customers')->id();

        if ($id) {
            return $this->join('cars', 'cars.number_car' ,'receive_votes.number_car_id')
            ->leftJoin('customers', 'customers.id', 'cars.customer_id')
            ->select('receive_votes.*','cars.number_car')
            ->where('customers.id', $id)
			->where(function ($query)  {
                $query
                ->orWhere('receive_votes.status', "0")
                ->orWhere('receive_votes.status', "4");
            })->get();
        } else {
            return responseServerError('Vui lòng đăng nhập!');
        }
    }

	public function cancelBookingRepair ($request  ,$id) {

		$idCus = auth()->guard('customers')->id();

        if ($idCus) {
            $receiveVote = $this->find($id);

			$data = $request->except(['id']);

			$data['status'] = "4";

			$receiveVote->update($data);

			return responseSuccess('Huỷ yêu cầu thành công!');
        } else {
            return responseServerError('Vui lòng đăng nhập!');
        }
	}

	public function detailCancel ($id) {
		$data = $this->findOrFail ($id);
		$data['repair_date'] = getDateAttribute($data['repair_date']);
		return $data;
	}
}
