<?php

namespace App\Http\Controllers;

use App\Models\Registrant;
use Illuminate\Http\Request;

class RegistrantController extends Controller
{
    public function index(Request $request)
    {
        $query = Registrant::query()->select('id', 'name', 'email');
        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $users,
            'message' => "Users successfully retrieved!",
        ], 200);
    }
}
