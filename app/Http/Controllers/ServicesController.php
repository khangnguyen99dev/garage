<?php

namespace App\Http\Controllers;

use App\Models\Services;
use Illuminate\Http\Request;
use App\Services\ImageService;

class ServicesController extends Controller
{
    protected $service;
    protected $imageService;

    function __construct (Services $service, ImageService $imageService) 
    {
        $this->service = $service;
        $this->image_service = $imageService;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->service->pagingServices ($request);
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
        return $this->service->storeServices ($request, $this->image_service);
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->service->showServices ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Services  $services
     * @return \Illuminate\Http\Response
     */
    public function edit(Services $services)
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
        return $this->service->updateServices ($request, $id, $this->image_service);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->service->deleteServices ($id);
    }

    public function getServices (Request $request) 
    {
        return $this->service->getServices ($request);
    }

    public function getServiceDetail ($slug) {
        $strArray = explode('-',$slug);
        $id = end($strArray);

        return $this->service->showServices ($id);
    }
}
