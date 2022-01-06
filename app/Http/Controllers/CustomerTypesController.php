<?php

namespace App\Http\Controllers;

use App\Models\CustomerTypes;
use Illuminate\Http\Request;

class CustomerTypesController extends Controller
{
    protected $customerTypes;

    function __construct (CustomerTypes $customerTypes) 
    {
        $this->customerType = $customerTypes;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->customerType->pagingCustomerTypes ($request);
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
        return $this->customerType->storeCustomerTypes ($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->customerType->showCustomerTypes ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CustomerTypes  $customerTypes
     * @return \Illuminate\Http\Response
     */
    public function edit(CustomerTypes $customerTypes)
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
        return $this->customerType->updateCustomerTypes ($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->customerType->deleteCustomerTypes ($id);
    }
}
