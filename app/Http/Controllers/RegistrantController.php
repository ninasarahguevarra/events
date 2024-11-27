<?php

namespace App\Http\Controllers;

use App\Models\Registrant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
    
    public function saveRegistrant(Request $request)
    {
        try {

            $data = [
                'event_id' => $request->event_id,
                'title' => $request->title,
                'name' => $request->name,
                'email' => $request->email,
                'gender' => $request->gender,
                'company' => $request->company ?? null,
                'company_address' => $request->company_address ?? null,
                'position' => $request->position ?? null,
                'affiliation' => $request->affiliation ?? null,
                'contact_number' => $request->contact_number ?? null,
                'is_agree_privacy' => $request->is_agree_privacy ?? false,
                'is_attended' => $request->is_attended ?? false,
            ];
            Registrant::validate($data);

            $registrant = Registrant::updateOrCreate(
                [
                    'event_id' => $request->event_id,
                    'email' => $request->email,
                    'company' => $request->company
                ], $data
            );

            return response()->json([
                'success' => true,
                'data'    => $registrant->fresh(),
                'message' => 'Registrant successfully added or updated.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error adding or updating registrant: ' . $e->getMessage(), [
                'exception' => $e,
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
                'trace'     => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while adding or updating the registrant.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function attendees(Request $request)
    {
        $query = Registrant::query()->select('id', 'name', 'email','updated_at')
        ->where('event_id',1)
        ->where('is_attended',1)
        ->get();
       

        return response()->json([
            'success' => true,
            'data'    => $query,
            'message' => "Users successfully retrieved!",
        ], 200);
    }
    
     public function forPrinting(Request $request)
    {
        
        $query = Registrant::query()->select('id', 'name', 'email')
        ->where('event_id',1)
        ->where('printed',0);
       
        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $users,
            'message' => "Users successfully retrieved!",
        ], 200);
    }
}