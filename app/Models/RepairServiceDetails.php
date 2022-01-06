<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RepairServiceDetails extends Model
{
    use HasFactory;

    protected $table = 'repair_service_details';
	protected $guarded = array('repair_vote_id','service_id');
    protected $primaryKey = array('repair_vote_id','service_id');

    protected $fillable = [
        'id',
        'repair_vote_id',
        'service_id',
        'price',
        'note',		
	];
}
