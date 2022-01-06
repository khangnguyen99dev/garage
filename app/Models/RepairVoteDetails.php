<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RepairVoteDetails extends Model
{
    use HasFactory;

    protected $table = 'repair_vote_details';
	protected $guarded = array('repair_vote_id','product_id');
    protected $primaryKey = array('repair_vote_id','product_id');

    protected $fillable = [
        'id',
        'repair_vote_id',
        'product_id',
        'price',
        'quantity',		
	];
}
