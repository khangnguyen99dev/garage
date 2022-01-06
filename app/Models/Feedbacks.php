<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Feedbacks extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
	protected $guarded = array('id');

    protected $fillable = [
        'repair_vote_id',
        'rating',
        'content',
	];

    public function pagingFeedbacks ($data) 
    {
		$rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';
        $fillterDate    = $data->get('fillterDate');
        $fillterStar    = $data->get('fillterStar');

		$query =   $this->join('repair_votes','repair_votes.id','feedbacks.repair_vote_id')
                        ->join('receive_votes','receive_votes.id','repair_votes.receive_vote_id')
                        ->join('cars','cars.number_car','receive_votes.number_car_id')
                        ->join('customers','customers.id','cars.customer_id')
                        ->where(function ($query) use ($val, $fieldsearch) {
                            if ($fieldsearch) {
                                $query = getQueryLike($query,$fieldsearch,$val);
                            }
                        });

        if ($fillterStar) {
            $query->where('feedbacks.rating', $fillterStar);
        }

        if ($fillterDate) {
            $date 	=  explode(",",$fillterDate);
            $start 	= Carbon::parse($date[0]);
            $end 	= Carbon::parse($date[1])->modify('23:59:00');

            $query->whereBetween('repair_votes.repair_date', [$start, $end]);
        }
        
        $query->select('feedbacks.*','customers.name as name_cus','cars.number_car','repair_votes.repair_date');



        $data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
    }

    public function addFeedback ($data) 
    {
        try {
            $this->create($data->toArray());
            return responseCreated('Cảm ơn quý khách đã phản hồi!');
        } catch (\Throwable $th) {
            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }

    
    public function showFeedback ($id) 
    {
        return $this->where('repair_vote_id', $id)->first();
    }

    public function showFeedbacks ($id) 
    {
        return $this->join('repair_votes','repair_votes.id','feedbacks.repair_vote_id')
                    ->join('receive_votes','receive_votes.id','repair_votes.receive_vote_id')
                    ->join('cars','cars.number_car','receive_votes.number_car_id')
                    ->join('customers','customers.id','cars.customer_id')
                    ->where('feedbacks.id',$id)
                    ->select(   'feedbacks.*','customers.name as name_cus',
                                'cars.number_car','repair_votes.repair_date',
                                'repair_votes.total_price','repair_votes.paymented',
                                'repair_votes.discount')
                    ->first();
    }
}
