<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\RepairVotes;
use App\Models\User;
use App\Models\Cars;
use Twilio\Rest\Client; 

class CollectVotes extends Model
{
    use HasFactory;

    protected $table = 'collect_votes';
	protected $guarded = array('id');

    protected $fillable = [
        'user_id',
        'repair_vote_id',
        'collect_date',
        'money'
	];

    public function RepairVotes () {
        return $this->belongsTo(RepairVotes::class , 'repair_vote_id');
    }

    public function Users () {
        return $this->belongsTo(User::class , 'user_id');
    }

    public function addCollectVote ($data) 
    {
        try {
            $data['user_id'] = auth()->id();
            
            $collect_vote = $this->create($data->toArray());

            $status = RepairVotes::where('id', $collect_vote->repair_vote_id)->value('status');

            if ($status == "5") {
                $phone = 	RepairVotes::join('receive_votes','receive_votes.id','repair_votes.receive_vote_id')
                                ->leftJoin('cars','cars.number_car','receive_votes.number_car_id')
                                ->leftJoin('customers','customers.id','cars.customer_id')
                                ->where('repair_votes.id',$collect_vote->repair_vote_id)
                                ->value('phone');

                $sid    = env('TWilIO_SID'); 
                $token  = env('TWilIO_TOKEN'); 

                $twilio = new Client($sid, $token); 
                
                $message = $twilio->messages 
                                ->create("+84".substr($phone,1), 
                                        array(  
                                            "messagingServiceSid" => env('MESSAGE_SID'),      
                                            "body" =>  "GARAGE AN KHANG - Cảm ơn bạn đã đến với Garage, Bạn vui lòng đánh giá để garage chúng tôi dần hoàn thiện hơn, Liên kết : http://127.0.0.1:8000/feedback/".$collect_vote->repair_vote_id
                                        ) 
                                ); 
            }

            return responseCreated('Thanh toán thành công!');
        } catch (\Throwable $th) {
            
            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }

    public function printInvoice ($id) {
        $data = $this->with('Users')
        ->join('repair_votes', 'repair_votes.id', 'collect_votes.repair_vote_id')
        ->join('receive_votes', 'receive_votes.id' ,'repair_votes.receive_vote_id')
        ->where('collect_votes.id', $id)
        ->select('collect_votes.*','receive_votes.number_car_id')
        ->first();

        $data['repair_votes'] = RepairVotes::with(['Services','Products','Users'])->where('id', $data->repair_vote_id)->first();

        $data['cars'] = Cars::with(['Customers', 'CarBrands'])->where ('number_car',$data->number_car_id)->first();
        return $data;
    }
}
