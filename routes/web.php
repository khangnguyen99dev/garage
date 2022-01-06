<?php


// Route::get('reset-password', function() {
//     return view('index');
// })->name('password.reset');

Route::get('{slug}', function () {
    return view('index');
})->where('slug', '^(?!api).*$');
