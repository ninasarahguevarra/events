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

            if ($event->id && $request->has('registrants') && !empty($request->registrants)) {
                $registrants = $request->registrants;
                $data = [
                    'event_id' => $event->id,
                    'title' => $registrants->title,
                    'name' => $registrants->name,
                    'email' => $registrants->email,
                    'company' => $registrants->company,
                    'company_address' => $registrants->company_address,
                    'position' => $registrants->position,
                    'affiliation' => $registrants->affiliation,
                    'contact_number' => $registrants->contact_number,
                    'score' => $registrants->score,
                    'is_agree_privacy' => $registrants->is_agree_privacy,
                    'gender' => $registrants->gender
                ];
                Registrant::validate($data);

                $event = Event::withTrashed()->create($data);

            }

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
            
            $event->update($data);
            $data = $event->fresh();

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
