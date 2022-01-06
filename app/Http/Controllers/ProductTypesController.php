<?php

namespace App\Http\Controllers;

use App\Models\ProductTypes;
use Illuminate\Http\Request;

class ProductTypesController extends Controller
{
    protected $productType;

    function __construct (ProductTypes $productType) 
    {
        $this->productType = $productType;
    }
        
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->productType->pagingProductTypes ($request);
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
        return $this->productType->storeProductTypes ($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->productType->showProductTypes ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProductTypes  $productTypes
     * @return \Illuminate\Http\Response
     */
    public function edit(ProductTypes $productTypes)
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
    public function update(Request $request,$id)
    {
        return $this->productType->updateProductTypes ($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->productType->deleteProductTypes ($id);
    }
}
