<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registrant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    public function index(Request $request)
    {
        // $query = SavedFile::withTrashed(); // Include soft-deleted records by default
        $query = Event::query(); 

        $query->when($request->has('search'), function ($q) use ($request) {
            $search = $request->input('search');
            $q->where(function($subQuery) use ($search) {
                $subQuery->where('name', 'like', '%' . $search . '%');
            });
        });
     
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $query->when($request->has('start_date') && $request->has('end_date'), function ($q) use ($request) {
             $start_date = $request->input('start_date');
             $end_date = $request->input('end_date');
             $q->whereBetween('date', [$start_date, $end_date]);
        });

        $order = $request->has('order_by') && $request->input('order_by') !== null ? $request->input('order_by') : 'created_at';
        $query->orderBy($order, 'desc');
     
        $perPage = $request->input('per_page', 10);
        $events = $query->paginate($perPage);
     
        return response()->json([
            'success' => true,
            'data'    => $events,
            'message' => "Saved files successfully retrieved!",
        ], 200);
    }

    public function saveEvent(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = [
                'name' => $request->name,
                'description' => $request->description,
                'location' => $request->location,
                'date' => $request->date,
                'status' => $this->determineStatus($request->date),
            ];
            
            Event::validate($data);
            $event = Event::withTrashed()->create($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $event,
                'message' => "Events successfully saved!",
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error saving event details: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'An error occurred while saving event details.',
                'details' => $e->getMessage(),
            ], 422);
        }
    }

    private function determineStatus($requestDate) {
        $requestDate = Carbon::parse($requestDate);
        $now = Carbon::now('Asia/Manila');
    
        $diffInDays = $now->diffInDays($requestDate);
        if ($diffInDays > 1) {
            return 'Pending';
        } else if ($diffInDays < 1 && $diffInDays > 0) {
            return 'In Progress';
        } else {
            return 'Completed';
        }
    }

    public function updateEvent(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $event = Event::find($id);

            if (!$event) {
                throw new \Exception("No existing event.");
            }

            $data = [
                'name' => $request->name,
                'description' => $request->description,
                'location' => $request->location,
                'date' => $request->date,
                'status' => $this->determineStatus($request->date),
            ];
            Event::validate($data);

            $registrantData = [];
            if ($request->has('registrants') && !empty($request->registrants)) {
                $registrants = $request->registrants;

                foreach ($registrants as $registrant) {
                    $data = [
                        'id' => $registrant['id'] ?? null,
                        'event_id' => null,
                        'title' => $registrant['title'],
                        'name' => $registrant['name'],
                        'email' => $registrant['email'],
                        'gender' => $registrant['gender'],
                        'company' => $registrant['company'],
                        'company_address' => $registrant['company_address'],
                        'position' => $registrant['position'],
                        'affiliation' => $registrant['affiliation'],
                        'contact_number' => $registrant['contact_number'],
                        'score' => $registrant['score'],
                        'is_agree_privacy' => $registrant['is_agree_privacy'],
                        'is_attended' => $registrant['is_attended']
                    ];
                    Registrant::validate($data);
                    $registrantData[] = Registrant::updateOrCreate(['id' => $registrant['id']], $data);
                }
            }
            
            $event->update($data);
            
            $data = [
                'event' => $event->fresh(),
                'registrant' => $registrantData,
            ];


            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => "Events successfully updated!",
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating event details: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'An error occurred while updating event details.',
                'details' => $e->getMessage(),
            ], 422);
        }
    }

    public function showEvent($id)
    {
        $event = Event::find($id);

        if (!$event) {
            throw new \Exception("No existing event.");
        }

        $registrants = Registrant::where('event_id', $id)->get();
        
        $data = [
            'event' => $event->fresh(),
            'registrant' => $registrants ?? null,
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => "Event details successfully retrieved",
        ]);

    }

    public function destroy($id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->delete();

            $event->status = "deleted"; // Update status to deleted
            $event->save();

            return response()->json(['message' => 'Event soft deleted'], 200);
        } catch (\Exception $e) {
            Log::error('Error in destroy method: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to soft delete event'], 500);
        }
    }
}
