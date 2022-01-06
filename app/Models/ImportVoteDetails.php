<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportVoteDetails extends Model
{
    use HasFactory;

    protected $table = 'import_vote_details';
	protected $guarded = array('id');
    public $timestamps = false;

    protected $fillable = [
        'import_vote_id',
        'product_id',
        'quantity',
        'import_price',
        'price',
	];
}
