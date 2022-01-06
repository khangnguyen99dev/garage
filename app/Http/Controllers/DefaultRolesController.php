<?php

namespace App\Http\Controllers;

use App\Models\DefaultRoles;
use Illuminate\Http\Request;

class DefaultRolesController extends Controller
{
    protected $defaultRole;

    function __construct (DefaultRoles $defaultRole) 
    {
        $this->defaultRole = $defaultRole;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return $this->defaultRole->storeDefaultRoles ($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->defaultRole->showDefaultRoles ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\DefaultRoles  $defaultRoles
     * @return \Illuminate\Http\Response
     */
    public function edit(DefaultRoles $defaultRoles)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        return $this->defaultRole->updateDefaultRoles ($request,$id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DefaultRoles  $defaultRoles
     * @return \Illuminate\Http\Response
     */
    public function destroy(DefaultRoles $defaultRoles)
    {
        //
    }
}
