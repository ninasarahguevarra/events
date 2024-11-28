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
            return 'Upcoming';
        } else if ($diffInDays < 1 && $diffInDays > 0) {
            return 'Ongoing';
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

            $eventData = [
                'name' => $request->name,
                'description' => $request->description,
                'location' => $request->location,
                'date' => $request->date,
                'status' => $this->determineStatus($request->date),
            ];
            Event::validate($eventData);

            $registrantData = [];
            if ($request->has('registrants') && !empty($request->registrants)) {
                $registrants = $request->registrants;

                foreach ($registrants as $registrant) {
                    $list = [
                        'id' => $registrant['id'] ?? null,
                        'event_id' => $id,
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
                    Registrant::validate($list);
                    $registrantData[] = Registrant::updateOrCreate(['id' => $registrant['id']], $list);
                }
            }
            
            $event->update($eventData);

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

    public function setEventAttendees(Request $request) {
        DB::beginTransaction();
        try {
            $event = Event::find($request->event_id);

            if (!$event) {
                throw new \Exception("No existing event.");
            }

            $registrant = Registrant::where('id', $request->registrant_id)->first();

            if (!$registrant) {
                throw new \Exception("No existing registrant, the QR code is not valid");
            }

            if (!$registrant['is_attended']) {
                $list = [
                    'id' => $registrant['id'],
                    'event_id' => $request->event_id,
                    'is_attended' => true
                ];
    
                $registrant->update($list);
    
                DB::commit();
    
                return response()->json([
                    'success' => true,
                    'message' => 'Registrant successfully marked as attended.',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Registrant already marked as attended.',
            ], 400);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error setting attendee: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'An error occurred while setting attendee.',
                'details' => $e->getMessage(),
            ], 422);
        }
    }

    public function showCurrentEvent() {
        $now = now();
        $currentEvent = Event::where('date', '<=', $now)
            ->orWhereBetween('date', [$now->startOfDay(), $now->endOfDay()])
            ->orderBy('date', 'asc')
            ->first();
    
        if (!$currentEvent) {
            $currentEvent = Event::where('date', '>', $now)->orderBy('date')->first();
        }
    
        if (!$currentEvent) {
            throw new \Exception("No current or upcoming event found.");
        }
    
        $attendees = Registrant::where('event_id', $currentEvent->id)
            ->where('is_attended', 1)
            ->orderBy('updated_at', 'asc')
            ->get(['id', 'name', 'email', 'company', 'updated_at']);
    
        $totalRegistrants = Registrant::where('event_id', $currentEvent->id)->count();
    
        $data = [
            'event' => $currentEvent,
            'attendees' => $attendees ?? null,
            'total_registrant' => $totalRegistrants,
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => "Event details successfully retrieved",
        ]);
    }

    public function showTopCompanies()
    {
        try {
            $topCompaniesData = Registrant::where('is_attended', true)
                ->whereNotNull('company')
                ->selectRaw('company, COUNT(*) as attendee_count')
                ->groupBy('company')
                ->orderBy('attendee_count', 'desc')
                ->limit(5)
                ->get();
    
            if ($topCompaniesData->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No attended registrants found.',
                ]);
            }
    
            return response()->json([
                'success' => true,
                'data' => $topCompaniesData,
                'message' => 'Top companies retrieved successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching the top companies.',
                'error' => $e->getMessage(),
            ]);
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
