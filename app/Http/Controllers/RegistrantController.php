<?php

namespace App\Http\Controllers;

use App\Models\Registrant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegistrantController extends Controller
{
    public function index(Request $request)
    {
        $query = Registrant::query()->select('id', 'name', 'email')->where('event_id', $request->event_id);
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
            $ictCouncil = $request->ict_council;
            $isIctInterested = null;
            $ictCouncilName = null;
            $industry = $request->industry === 'Other' ? $request->other_industry : $request->industry;
            $shirtSize = $request->shirt_size === 'n/a' ? null : $request->shirt_size;
            $agreeToBeContacted = $request->agree_to_be_contacted ?? false;

            if ($ictCouncil === "yes") {
                $ictCouncilName = $request->ict_council_name;
                $isIctInterested = null; // Clear is_ict_interested
            } else if ($ictCouncil === "interested") {
                $ictCouncilName = null; // Clear council name
                $isIctInterested = true;
            } else if ($ictCouncil === "n/a") {
                $ictCouncilName = null; // Clear council name
                $isIctInterested = null; // Clear is_ict_interested
            }

            if ($request->is_ict_member === 'yes') {
                $isIctMember = true;
            } else if ($request->is_ict_member === 'no') {
                $isIctMember = false;
            } else {
                $isIctMember = $request->is_ict_member === 'n/a';
            }

            $data = [
                'event_id' => $request->event_id,
                'title' => $request->title,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'name' => $request->name ?? $request->first_name . ' ' . $request->last_name,
                'preferred_name' => $request->preferred_name,
                'email' => $request->email,
                'gender' => $request->gender,
                'social_classification' => $request->social_classification,
                'province' => $request->province,
                'municipality' => $request->municipality,
                'company' => $request->company ?? null,
                'company_address' => $request->company_address ?? null,
                'position' => $request->position ?? null,
                'affiliation' => $request->affiliation ?? null,
                'sector' => $request->sector,
                'industry' => $industry,
                'ict_council_name' => $ictCouncilName,
                'is_ict_interested' => $isIctInterested,
                'is_ict_member' => $isIctMember,
                'attendance_qualification' => $request->attendance_qualification,
                'registration_type_id' => $request->registration_type_id,
                'shirt_size' => $shirtSize,
                'social_media' => $request->social_media,
                'website' => $request->website,
                'contact_number' => $request->contact_number ?? null,
                'is_agree_privacy' => $request->is_agree_privacy ?? false,
                'agree_to_be_contacted' => $agreeToBeContacted,
                'is_attended' => $request->is_attended ?? false,
            ];
            Registrant::validate($data);
            
            $registrant = Registrant::updateOrCreate(
                [
                    'event_id' => $request->event_id,
                    'email' => $request->email,
                    'name' => $data['name'] ?? $request->name,
                    'contact_number' => $request->contact_number,
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
                'error' => 'Error adding or updating registrant.',
                'details' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
    
    public function attendees(Request $request)
    {
        $query = Registrant::query()->select('id', 'name', 'email','updated_at')
        ->where('event_id',1)
        ->where('is_attended',1)
        ->orderBy('updated_at','desc')
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
        ->where('event_id', $request->event_id)
        ->where('printed',0);
       
        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $users,
            'message' => "Users successfully retrieved!",
        ], 200);
    }
    
    public function fetchRegistrantByGender(Request $request)
    {
        $registrantCounts = Registrant::selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->where('event_id', 1)
            ->get();
    
        $genderData = $registrantCounts->mapWithKeys(function ($item) {
            return [$item->gender => $item->count];
        });
    
        return response()->json([
            'success' => true,
            'data' => $genderData,
        ]);
    }
}
