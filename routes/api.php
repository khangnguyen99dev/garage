<?php

use Illuminate\Http\Request;

// Auth Endpoints
Route::group([
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', 'Auth\LoginController@login');
    Route::post('logout', 'Auth\LogoutController@logout');
    Route::post('register', 'Auth\RegisterController@register');
    Route::post('forgot-password', 'Auth\ForgotPasswordController@email');
    Route::post('password-reset', 'Auth\ResetPasswordController@reset');
});



Route::group([
    'middleware' => 'auth:api'
], function ($router) {

    Route::apiResource('suppliers', 'SuppliersController');
    Route::apiResource('customer-types', 'CustomerTypesController');
    Route::apiResource('car-brands', 'CarBrandsController');
    Route::apiResource('customers', 'CustomersController');
    Route::apiResource('cars', 'CarsController');
    Route::apiResource('receive-votes', 'ReceiveVotesController');
    Route::apiResource('product-types', 'ProductTypesController');
    Route::apiResource('products', 'ProductsController');
    Route::apiResource('categories', 'CategoriesController');
    Route::apiResource('service-types', 'ServiceTypesController');
    Route::apiResource('services', 'ServicesController');
    Route::apiResource('repair-votes', 'RepairVotesController');
    Route::apiResource('users', 'UsersController');
    Route::apiResource('export-votes', 'ExportVotesController');
    Route::apiResource('import-votes', 'ImportVotesController');
    Route::apiResource('roles', 'RolesController');
    Route::apiResource('menus', 'MenusController');
    Route::apiResource('default-roles', 'DefaultRolesController');
    Route::apiResource('news', 'NewsController');


    Route::get('user-menus/{id}', 'UsersController@getMenuUser');
    Route::get('export-votes/{id}/edit', 'ExportVotesController@edit');
    Route::get('import-votes/{id}/edit', 'ImportVotesController@edit');
    Route::get('bookings', 'ReceiveVotesController@pagingBookings');
    Route::put('accept-receive-vote/{id}', "ReceiveVotesController@acceptReceiveVote");
    Route::put('cancel-receive-vote/{id}', "ReceiveVotesController@cancelReceiveVote");
    Route::get('accept-repair/{id}/edit', 'RepairVotesController@edit');

    Route::post('add-collect-vote', 'RepairVotesController@addCollectVote');
    Route::get('collect-votes/{id}','RepairVotesController@showCollectVote');

    Route::get('print-invoice/{id}', 'RepairVotesController@printInvoice');
    Route::get('customer-payment-repair/{id}', 'RepairVotesController@customerPaymentRepair');

    Route::get('supplier-payment/{id}','ImportVotesController@supplierPayment');
    Route::post('add-payment-vote','ImportVotesController@addPaymentVote');
    Route::get('show-supplier-payment/{id}','ImportVotesController@showSupplierPayment');
    Route::get('payment-votes/{id}','ImportVotesController@showPaymentVote');
    Route::get('print-payment-votes/{id}','ImportVotesController@printPaymentVote');

    Route::get('employee-technical','UsersController@getEmployeeTechnical');
    Route::put('update-info/{id}','UsersController@updateInfo');

    Route::put('update-business-info/{id}', 'UsersController@updateBusinessInfo');

    Route::post('dashbroad', 'DashbroadController@getDashbroad');

    Route::apiResource('feedbacks','FeedbacksController');
});

Route::post('register', 'ClientController@register');
Route::post('login', 'ClientController@login');
Route::post('re-password', 'ClientController@resetPassword');
Route::get('service-clients', 'ServicesController@getServices');
Route::get('new-clients', 'NewsController@getNews');
Route::get('service-details/{slug}', 'ServicesController@getServiceDetail');
Route::get('new-details/{slug}', 'NewsController@getNewDetail');
Route::get('setting-info', 'DashbroadController@getSetting');

Route::group([
    'middleware' => 'auth:customers'
], function ($router) {
    Route::apiResource('car-profile', 'CarsProfileController');
    Route::get('car-brand-clients', 'CarBrandsController@index');
    Route::get('user-profile', 'ClientController@userProfile');
    Route::put('user-profile/{id}', 'ClientController@updateUserProfile');
    Route::post('bookings', 'ClientController@bookings');
    Route::get('history-repairs', 'ClientController@getHistoryRepairs');
    Route::get('repair-detail/{id}', 'ClientController@repairDetail');
    Route::get('booking-repairs', 'ClientController@bookingRepair');
    Route::put('cancel-booking-repair/{id}', 'ClientController@cancelBookingRepair');
    Route::get('detail-cancel/{id}','ClientController@detailCancel');

    Route::get('get-feedback/{id}','ClientController@getFeedback');
    Route::post('add-feedback','ClientController@addFeedback');
    Route::get('show-feedback/{id}','ClientController@showFeedback');

    Route::post('change-password', 'ClientController@changePass');
});



