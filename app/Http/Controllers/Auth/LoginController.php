<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\APIController;

class LoginController extends ApiController
{

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return $this->responseUnauthorized();
        }

        $user = auth()->user();

        return response()->json([
            'status' => 200,
            'message' => 'Authorized.',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 500,
            'user' => array(
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'avatar' => $user->avatar
            )
        ], 200);
    }
}
