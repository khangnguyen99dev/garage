<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\ImageService;
use App\Models\Setting;

class UsersController extends Controller
{
    protected $user;
    protected $imageService;
    protected $settingInfo;

    function __construct(User $user, ImageService $imageService, Setting $setting) {
        $this->user = $user;
        $this->image_service = $imageService;
        $this->setting = $setting;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->user->pagingUsers ($request);
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
        return $this->user->storeUsers ($request, $this->image_service);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->user->showUsers ($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getMenuUser($id)
    {
        return $this->user->getMenuUser ($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        return $this->user->updateUsers ($request, $id, $this->image_service);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->user->deleteUsers ($id);
    }

    public function getEmployeeTechnical () {
        return $this->user->getEmployeeTechnical ();
    }

    public function updateInfo (Request $request, $id) {
        return $this->user->updateInfo ($request , $id, $this->image_service);
    }

    public function updateBusinessInfo (Request $request, $id) {
        return $this->setting->updateBusinessInfo ($request, $id, $this->image_service);
    }
}
