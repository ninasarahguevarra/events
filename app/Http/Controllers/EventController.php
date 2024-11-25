<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
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

    public function update($id)
    {

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
