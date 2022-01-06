<?php

namespace App\Http\Controllers;

use App\Models\RepairVotes;
use App\Models\CollectVotes;
use Illuminate\Http\Request;

class RepairVotesController extends Controller
{
    protected $repairVote;
    protected $collectVote;

    function __construct (RepairVotes $repairVote, CollectVotes $collectVote) 
    {
        $this->repairVote = $repairVote;
        $this->collectVote = $collectVote;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->repairVote->pagingRepairVotes ($request);
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
        return $this->repairVote->storeRepairVotes ($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->repairVote->showRepairVotes ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return $this->repairVote->acceptRepair ($id);
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
        return $this->repairVote->updateRepairVotes ($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->repairVote->deleteRepairVotes ($id);
    }

    public function addCollectVote (Request $request)
    {
        return $this->collectVote->addCollectVote($request);
    }

    public function showCollectVote ($id)
    {
        return $this->repairVote->showCollectVote ($id);
    }

    public function printInvoice ($id) {
        return $this->collectVote->printInvoice ($id);
    }

    public function customerPaymentRepair ($id) {
        return $this->repairVote->customerPaymentRepair ($id);
    }
}
