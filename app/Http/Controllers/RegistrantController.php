<?php

namespace App\Http\Controllers;

use App\Models\Registrant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Event;
use Carbon\Carbon;

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
            
            $event = Event::find($request->event_id)->toArray();
            $event['date'] = Carbon::parse($event['date'])->toDateString();
            $event['end_date'] = Carbon::parse($event['end_date'])->format('M, d Y');
            
            $registrant = Registrant::updateOrCreate(
                [
                    'event_id' => $request->event_id,
                    'email' => $request->email,
                    'name' => $data['name'] ?? $request->name,
                    'affiliation' => $request->affiliation,
                    'contact_number' => $request->contact_number,
                ], $data
            )->load('event');
            $qrCode = QrCode::format('png')->size(300)->generate($registrant->id);
            
            $base64 = base64_encode($qrCode);    
            
            $emailData = [
                'data' => $registrant,
                'event' => $event,
            ];
         
            $imageName = $registrant->id.'.png';  
            $storage = Storage::put('temp/' . $imageName, $qrCode);
            
            $mail = Mail::send('emails.registration_email', $emailData, function ($message) use ($registrant, $imageName) {
                $message->to($registrant->email)
                ->subject('Confirmation of Your Registration for CLICkConEx 2025 and Event Details')
                ->attach(storage_path('app/private/temp/' . $imageName), [
                    'as' => $imageName,
                    'mime' => 'image/png',
                ]);
            });

            return response()->json([
                'success' => true,
                'data'    => $registrant->fresh()->load('event'),
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
    
    public function uploadBulkRegistration(Request $request, $eventId)
    {
        // Validate file input
        $validator = Validator::make($request->all(), [
            'csv_file' => 'required|mimes:csv,txt|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            DB::beginTransaction();
            
            $file = $request->file('csv_file');
            $handle = fopen($file->getPathname(), 'r');

            // Skip the first row if it contains headers
            fgetcsv($handle);

            $batchData = [];
            $rowCount = 0;

            while (($row = fgetcsv($handle, 1000, ',')) !== false) {

                $is_agree_privacy = strtolower(trim($row[21]));
                $is_agree_privacy = $is_agree_privacy == 'yes' || $is_agree_privacy === 'true';
                $agree_to_be_contacted = strtolower(trim($row[22]));
                $agree_to_be_contacted = $agree_to_be_contacted == 'yes' || $agree_to_be_contacted === 'true';
                $is_ict_member = strtolower(trim($row[15]));
                $is_ict_member = $is_ict_member == 'yes' || $is_ict_member === 'true';
                $is_ict_interested = strtolower(trim($row[14]));
                $is_ict_interested = $is_ict_interested == 'yes' || $is_ict_interested === 'true';
                $ict_council_name = trim($row[13]);

                if (!$ict_council_name || strtolower($ict_council_name) == 'n/a' || strtolower($ict_council_name) == 'n-a' ) {
                    $ict_council_name = null;
                    $is_ict_interested = false;
                    $is_ict_member = false;
                }

                $batchData[] = [
                    'id'                        => Str::uuid()->toString(),
                    'event_id'                  => $eventId,
                    'first_name'                => trim($row[0]),
                    'last_name'                 => trim($row[1]),
                    'name'                      => trim($row[0]) . ' ' . trim($row[1]),
                    'preferred_name'            => trim($row[2]),
                    'email'                     => trim($row[4]),
                    'gender'                    => trim($row[3]),
                    'social_classification'     => trim($row[11]),
                    'province'                  => trim($row[6]),
                    'municipality'              => trim($row[7]),
                    'position'                  => trim($row[9]),
                    'affiliation'               => trim($row[8]),
                    'sector'                    => trim($row[10]),
                    'industry'                  => trim($row[12]),
                    'ict_council_name'          => $ict_council_name,
                    'is_ict_interested'         => $is_ict_interested,
                    'is_ict_member'             => $is_ict_member,
                    'attendance_qualification'  => trim($row[16]),
                    'registration_type_id'      => trim($row[17]),
                    'shirt_size'                => trim($row[18]),
                    'social_media'              => trim($row[19]),
                    'website'                   => trim($row[20]),
                    'contact_number'            => trim($row[5]),
                    'is_agree_privacy'          => $is_agree_privacy,
                    'agree_to_be_contacted'     => $agree_to_be_contacted,
                    'is_csv_uploaded'           => true,
                    'created_at'                => now(),
                    'updated_at'                => now()
                ];

                $rowCount++;
                // Registrant::validate($batchData);

                // Insert in chunks of 100
                if ($rowCount % 100 == 0) {
                    Registrant::insert($batchData);
                    $batchData = [];
                }
            }

            // Insert remaining data if any
            if (!empty($batchData)) {
                Registrant::insert($batchData);
            }

            fclose($handle);
            DB::commit();

            return response()->json([
                'message' => 'Bulk registration successful.',
                'success' => true
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'error' => 'Something went wrong.', 'details' => $e->getMessage()], 500);
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
