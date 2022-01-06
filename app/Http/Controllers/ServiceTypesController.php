<?php

namespace App\Http\Controllers;

use App\Models\ServiceTypes;
use Illuminate\Http\Request;

class ServiceTypesController extends Controller
{
    protected $service_type;

    function __construct (ServiceTypes $service_type) 
    {
        $this->service_type = $service_type;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->service_type->pagingServiceTypes ($request);
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
        return $this->service_type->storeServiceTypes ($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->service_type->showServiceTypes ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ServiceTypes  $serviceTypes
     * @return \Illuminate\Http\Response
     */
    public function edit(ServiceTypes $serviceTypes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        return $this->service_type->updateServiceTypes ($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->service_type->deleteServiceTypes ($id);
    }
}
