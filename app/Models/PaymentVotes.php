<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Suppliers;

class PaymentVotes extends Model
{
    use HasFactory;

    protected $table = 'payment_votes';
	protected $guarded = array('id');

    protected $fillable = [
        'user_id',
        'import_vote_id',
        'payment_date',
        'money'
	];

    public function Suppliers () {
        return $this->belongsTo(Suppliers::class , 'import_vote_id');
    }

    public function Users () {
        return $this->belongsTo(User::class , 'user_id');
    }

    public function addPaymentVote ($data) 
    {
        try {
            $data['user_id'] = auth()->id();
            
            $this->create($data->toArray());

            return responseCreated('Thanh toán thành công!');
        } catch (\Throwable $th) {
            
            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }

    public function showPaymentVote ($id) {
        return $this->join('import_votes','import_votes.id','payment_votes.import_vote_id')
                    ->join('users','users.id','payment_votes.user_id')
                    ->where('import_votes.id',$id)
                    ->select('payment_votes.*', 'users.name as employee')
                    ->get();
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

    public function printPaymentVote ($id) {
        $data = $this->join('import_votes','import_votes.id','payment_votes.import_vote_id')
                    ->join('users','users.id','payment_votes.user_id')
                    ->join('suppliers','suppliers.id','import_votes.supplier_id')
                    ->where('payment_votes.id', $id)
                    ->select('payment_votes.*','users.name as employee', 'suppliers.name as name_supplier','import_votes.import_code','import_votes.total_price')
                    ->first();

        $products = ImportVotes::with('Products')->where('id', $data->import_vote_id)->first();

        $data['products'] = $products->products;

        return $data;
    }
}
