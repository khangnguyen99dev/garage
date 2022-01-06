<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExportVoteDetails extends Model
{
    use HasFactory;

    protected $table = 'export_vote_details';
	protected $guarded = array('id');

    protected $fillable = [
        'export_vote_id',
        'product_id',
        'quantity',
        'price',
	];
}
