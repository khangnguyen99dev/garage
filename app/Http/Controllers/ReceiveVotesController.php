<?php

namespace App\Http\Controllers;

use App\Models\ReceiveVotes;
use Illuminate\Http\Request;

class ReceiveVotesController extends Controller
{

    protected $receiveVote;

    function __construct (ReceiveVotes $receiveVote) 
    {
        $this->receiveVote = $receiveVote;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->receiveVote->pagingReceiveVotes ($request);
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
        return $this->receiveVote->storeReceiveVotes ($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->receiveVote->showReceiveVotes ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReceiveVotes  $receiveVotes
     * @return \Illuminate\Http\Response
     */
    public function edit(ReceiveVotes $receiveVotes)
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
        return $this->receiveVote->updateReceiveVotes ($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->receiveVote->deleteReceiveVotes ($id);
    }

    public function pagingBookings (Request $request) {
        return $this->receiveVote->pagingBookings ($request);
    }

    public function acceptReceiveVote (Request $request, $id) {
        return $this->receiveVote->acceptReceiveVote ($request, $id);
    }

    public function cancelReceiveVote (Request $request, $id) {
        return $this->receiveVote->cancelReceiveVote ($request, $id);
    }
}
