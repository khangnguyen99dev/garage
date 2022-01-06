<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ExportVoteDetails;
use App\Models\RepairVotes;
use App\Models\Products;
use Auth;
use DB;
use Carbon\Carbon;

class ExportVotes extends Model
{
    use HasFactory;

    protected $table = 'export_votes';
	protected $guarded = array('id');

    protected $fillable = [
        'repair_vote_id',
        'user_id',
        'export_date',
        'vote_date',
        'note',
        'status',
	];

    public function Products () 
    {
        return $this->belongsToMany(Products::class , 'export_vote_details', 'export_vote_id', 'product_id')->withPivot('quantity','price','id');
    }

    public function pagingExportVotes ($data) 
    {
        $rows           = $data->get('per_page');
		$search         = $data->get('search');
		$fieldsearch    = $data->get('fieldsearch');
		$val            = '%'.$search.'%';
        $fillterDate    = $data->get('fillterDate');
        $status			= $data->get('status');

		$query = $this->join('users', 'users.id', 'export_votes.user_id')
        ->join('repair_votes', 'repair_votes.id' ,'export_votes.repair_vote_id')
        ->leftJoin('receive_votes', 'receive_votes.id','repair_votes.receive_vote_id')
        ->leftJoin('cars', 'cars.number_car', 'receive_votes.number_car_id')
        ->leftJoin('customers','customers.id','cars.customer_id')
        ->where(function ($query) use ($val, $fieldsearch) {
			if ($fieldsearch) {
				$query = getQueryLike($query,$fieldsearch,$val);
			}
		});

        $query->select('export_votes.*','users.name as name_emp', 'customers.name as name_cus', 'cars.number_car', 'receive_votes.id as receive_vote_id');

        if ($fillterDate) {
			$date   =  explode(",",$fillterDate);
			$start  = Carbon::parse($date[0]);
			$end    = Carbon::parse($date[1])->modify('23:59:00');

			$query->whereBetween('export_votes.vote_date', [$start, $end]);
		}

        if (isset($status)) {
			$query->where('export_votes.status', $status);
		}

		$data = $rows ? $query->orderBy('id','DESC')->paginate($rows) : $query->orderBy('id','DESC')->get();

		return $data;
    }

    public function showExportVotes ($id) 
    {
        $data = $this->with('Products')->where('id', $id)->first();
        $data['vote_date'] = $this->getDateAttribute($data['vote_date']);
        return $data;
    }

    public function getDateAttribute($value)
	{
    	return Carbon::parse($value)->format('Y-m-d\TH:i');
	}

    public function storeExportVotes ($data)
    {
        DB::beginTransaction();
        try {
            $products = $data['products'];
            if (sizeof($products) > 0 ) {

                $data['user_id'] = Auth::id();

                $exportVote = $this->create($data->except(['products']));
    
                if ($exportVote) {
                    foreach($products as $key => $value) {
                        $products[$key]['export_vote_id'] = $exportVote->id;
                    }
                    ExportVoteDetails::insert($products);
                }
            }

            $statusRepairVote = RepairVotes::find($data['repair_vote_id']);
            $statusRepairVote->status = "1";
            $statusRepairVote->save();

            DB::commit();

			return responseCreated('Lập phiếu xuất phụ tùng thành công!');

		} catch (\Throwable $th) {

            DB::rollback();
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
    }

    public function updateExportVotes ($data, $id)
    {
        DB::beginTransaction();
        try {
			$exportVote = $this->findOrFail ($id);

			$exportVote->update($data->except(['products']));

            $products = $data->products;

            if (sizeof($products) > 0) {
                foreach($products as $key => $product) {
                    $products[$key]['export_vote_id'] = $exportVote->id;
                    unset($products[$key]['name']);
                }

                $idProducts = array_column($products, 'product_id');

                ExportVoteDetails::where('export_vote_id', $exportVote->id)->whereNotIn('product_id',$idProducts)->delete();
                
                foreach ($products as $product) {
                    if(!isset($product['id']) || (isset($product['id']) && $product['id']=='')){
                        $product['export_vote_id'] = $exportVote->id;
                        ExportVoteDetails::insert($product);
                    }else{
                        $updateExportVote = ExportVoteDetails::where('id',$product['id']);
                        $updateExportVote->update($product);
                    }
                } 
            } else {
                ExportVoteDetails::where('export_vote_id', $exportVote->id)->delete();
            }

            DB::commit();

            return responseSuccess('Cập nhật phiếu xuất kho thành công!');

		} catch (\Throwable $th) {

            DB::rollback();

			return responseServerError('Có lỗi trong quá trình thực hiện');
		} 
    }

    public function changeStatus ($id)
    {       
        DB::beginTransaction();
        try {
            $exportVote = $this->find($id);
            $exportVote->update([
                'status' => '1',
                'export_date' => Carbon::now(),
            ]);

            $repairVote = RepairVotes::where('id',$exportVote->repair_vote_id)->first();
            $repairVote->update(['status' => '2']);

            DB::commit();

            return responseSuccess('Xác nhận xuất kho thành công!');
        } catch (\Throwable $th) {

            DB::rollback();
            return responseServerError('Có lỗi trong quá trình thực hiện');
        }
    }

    public function deteteExportVotes ($id) {
		try {
			$exportVote = $this->findOrFail ($id);

			$exportVote->delete();

			return responseSuccess('Xóa phiếu xuất kho thành công!');

		} catch (\Throwable $th) {
			return responseServerError('Có lỗi trong quá trình thực hiện');
		}
    }
}
