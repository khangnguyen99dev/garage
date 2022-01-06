<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class CustomRoles extends Authenticatable
{
    use HasFactory;

    protected $table = 'custom_roles';
	protected $guarded = array('id');

    protected $fillable = [
        'user_id',
        'menu_id'
	];
}
