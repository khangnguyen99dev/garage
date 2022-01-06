<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReceiveVotes;
use App\Models\Customers;
use App\Services\ImageService;
use App\Models\RepairVotes;
use App\Models\Feedbacks;

class ClientController extends Controller
{
    
    protected $receive_vote;
    protected $customer;
    protected $imageService;
    protected $repair_vote;
    protected $feedback;

    function __construct (
        ReceiveVotes $receive_vote,
        Customers $customer, 
        ImageService $imageService,
        RepairVotes $repair_vote,
        Feedbacks $feedback
        ) 
    {
        $this->receive_vote = $receive_vote;
        $this->customer = $customer;
        $this->imageService = $imageService;
        $this->repair_vote = $repair_vote;
        $this->feedback = $feedback;
    }

    public function register (Request $request) {
        return $this->customer->register ($request);
    }

    public function login () {
        return $this->customer->login (request(['phone', 'password']));
    }

    public function userProfile () {
        return $this->customer->userProfile ();
    }

    public function updateUserProfile (Request $request , $id) {
        return $this->customer->updateUserProfile ($request, $id, $this->imageService);
    }

    public function bookings (Request $request) {
        return $this->receive_vote->bookings ($request);
    }

    public function resetPassword (Request $request) {
        return $this->customer->resetPassword ($request);
    }

    public function getHistoryRepairs () {
        return $this->repair_vote->getHistoryRepairs ();
    }

    public function repairDetail ($id) {
        return $this->repair_vote->showRepairVotes ($id);
    }

    public function bookingRepair () {
        return $this->receive_vote->bookingRepair ();
    }

    public function cancelBookingRepair (Request $request,$id) {
        return $this->receive_vote->cancelBookingRepair ($request, $id);
    }

    public function detailCancel ($id) {
        return $this->receive_vote->detailCancel ($id);
    }

    public function getFeedback ($id) {
        return $this->repair_vote->getFeedback ($id);
    }

    public function addFeedback (Request $request) {
        return $this->feedback->addFeedback ($request);
    }

    public function showFeedback ($id) {
        return $this->feedback->showFeedback ($id);
    }

    public function changePass (Request $request) {
        return $this->customer->changePass ($request);
    }
}
