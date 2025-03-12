<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //

    public function index(Request $request)
    {
        $users = UserResource::collection(User::all());

        return inertia('users/index', compact('users'));
    }

    public function get_users_list(Request $request)
    {
        $users = UserResource::collection(User::all());

        return response()->json(
            $users,
        );
    }
    public function create()
    {
        return inertia('users/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return redirect()->route('users.index')->with('status', 'User created successfully.');
    }
}
