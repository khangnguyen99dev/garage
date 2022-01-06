<?php

namespace App\Http\Controllers;

use App\Models\ImportVotes;
use Illuminate\Http\Request;
use App\Models\PaymentVotes;
use App\Services\ImageService;

class ImportVotesController extends Controller
{
    protected $importVote;
    protected $paymentVote;
    protected $imageService;

    function __construct (ImportVotes $importVote, PaymentVotes $paymentVote, ImageService $imageService) 
    {
        $this->importVote = $importVote;
        $this->paymentVote = $paymentVote;
        $this->image_service = $imageService;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->importVote->pagingImportVotes ($request);
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
        return $this->importVote->storeImportVotes ($request, $this->image_service);
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->importVote->showImportVotes ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return $this->importVote->confirmImportVotes ($id);
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
        return $this->importVote->updateImportVotes ($request, $id, $this->image_service);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->importVote->deleteImportVotes ($id);
    }

    public function supplierPayment ($id) {
        return $this->importVote->supplierPayment ($id);
    }

    public function addPaymentVote (Request $request) {
        return $this->paymentVote->addPaymentVote ($request);
    }

    public function showSupplierPayment ($id) {
        return $this->importVote->showSupplierPayment ($id);
    }

    public function showPaymentVote ($id) {
        return $this->paymentVote->showPaymentVote ($id);
    }

    public function printPaymentVote ($id) {
        return $this->paymentVote->printPaymentVote ($id);
    }
}
