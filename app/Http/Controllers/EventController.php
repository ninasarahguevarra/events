<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registrant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

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
                'end_date' => $request->end_date,
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
                'end_date' => $request->end_date,
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
        
        return response()->json([
                    'success' => true,
                    'message' => 'QR code cannot be scanned. Event has already ended.',
                ], 200);    
        
        DB::beginTransaction();
        try {
            $event = Event::find($request->event_id);

            if (!$event) {
                throw new \Exception("No existing event.");
            }

            $eventDate = Carbon::parse($event->date);
            $currentTime = Carbon::now();
            $eventEndTime = $eventDate->addHours(9);

            if ($currentTime->gt($eventEndTime)) {
                return response()->json([
                    'success' => true,
                    'message' => 'QR code cannot be scanned. Event has already ended.',
                ], 200);
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

        return response()->json([
            'success' => true,
            'data' => $event,
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

    public function downloadCsvTemplate()
    {
        $filePath = 'format.csv';
        $fileName = 'format.csv';
        if (!Storage::exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found.'
            ], 404);
        }

        return Storage::download($filePath, $fileName);
    }
    
    public function saveIdLayout(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'event_id' => 'required',
                // 'bgimage' => 'required|file|mimes:jpg,jpeg,png|max:2048',
                'layout' => 'required',
            ]);
        
            $layout = json_decode($request->layout, true);

            if (!is_array($layout)) {
                return response()->json(['error' => 'The layout field must be an array.'], 400);
            }
            $event = Event::find($request->event_id);

            if (!$event) {
                return response()->json([
                    'error' => 'No event found!',
                ], 404);
            }

            $bgImagePath = $event->id_layout['bgimage'] ?? null;

            if ($request->hasFile('bgimage')) {
                // Delete the old image if it exists
                if ($bgImagePath && Storage::disk('public')->exists(str_replace(asset('storage/'), '', $bgImagePath))) {
                    Storage::disk('public')->delete(str_replace(asset('storage/'), '', $bgImagePath));
                }

                $newImagePath = $request->file('bgimage')->store("id/bg/{$request->event_id}", 'public');
                // $bgImagePath = asset("storage/$newImagePath");
                $bgImagePath = $newImagePath;
            }


            // Save Data
            $event->id_layout = [
                'bgimage' => $bgImagePath,
                'layout' => $layout, // Now it's an array
            ];
            $event->save();
    
            return response()->json([
                'success' => true,
                'message' => 'Id layout Saved!',
                'data' => $event->id_layout
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating events id layout: ' . $e->getMessage(), [
                'exception' => $e,
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
                'trace'     => $e->getTraceAsString(),
                'payload'   => $request->all(),
            ]);

            return response()->json([
                'error' => 'Error updating events id layout.',
                'details' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function fetchIdLayout(Request $request)
    {
        $event = Event::find($request->event_id);
        if (!$event) {
            return response()->json([
                'error' => 'No event found!',
            ], 404);
        }

        $url = null;
        if (isset($event->id_layout['bgimage'])) {
            $url = Storage::url($event->id_layout['bgimage']);
        }

        $data = [
            'layout' => $event->id_layout['layout'] ?? null,
            'bgimage' => $url
        ];
        
        return response()->json([
            'message' => 'Id layout fetch!',
            'data' => $data
        ]);
    }

    public function generateImages(Request $request)
    {
    
        
        $event = Event::find($request->event_id);
        
        $eventData = [
            "bgimage" => "storage/".$event->id_layout['bgimage'],
            "layout" => $event->id_layout['layout']
            ];
            
            
        $perPage = 50; 
        $page = max(1, (int) $request->page); 
        $offset = ($page - 1) * $perPage;

        $registrants = Registrant::select(
            'id',
            DB::raw("CONCAT(first_name, ' ', last_name) AS name"),
            'affiliation'
        )
        ->where('event_id', $request->event_id)
        ->offset($offset)
        ->limit($perPage)
        ->get();
        
        $images = [];
        $outputDir = public_path('generated_images');

        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0777, true);
        }

        foreach ($registrants as $data) {
            $bgPath = public_path($eventData['bgimage']);

            if (!file_exists($bgPath)) {
                return response()->json(['error' => 'Background image not found: ' . $bgPath], 404);
            }

            $img = Image::make($bgPath)->resize(638, 1012, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            $fontPath = public_path('fonts/arial/ARIBLK.TTF');
            
            $yPlus = 0;

            foreach ($eventData['layout'] as $item){
                if ($item['type'] === 'name' || $item['type'] === 'organization') {
                    $text = ($item['type'] === 'name') ? $data['name'] : $data['affiliation'];
                    $maxFontSize = round($item['size'] * 2.5);
                    $minFontSize = 20;
                    $maxWidth = $img->width() - 80; // 40px padding on each side
                    $fontSize = $maxFontSize;

                    // Adjust font size only if text exceeds max width
                    while ($this->getTextWidth($text, $fontSize, $fontPath) > $maxWidth && $fontSize > $minFontSize) {
                        $fontSize -= 1;
                    }

                    $xPos = $img->width() / 2;  
                    $yPos = $yPlus + round($item['position']['y'] * 2.5);
                    $yPlus += $maxFontSize;
                    
                    $img->text($text, $xPos, $yPos, function ($font) use ($fontSize, $item, $fontPath) {
                        $font->file($fontPath);
                        $font->size($fontSize);
                        $font->color($item['color'] === 'white' ? '#fff' : '#000');
                        $font->align('center');
                        $font->valign('top');
                    });
                }
            }

            // Generate QR code
            foreach ($eventData['layout'] as $item) {
                if ($item['type'] === 'qrcode') {
                    $qrCodePath = storage_path('app/temp_qrcode.png');
                    file_put_contents($qrCodePath, QrCode::format('png')->size(round($item['size'] * 2.5))->generate($data['id']));

                    if (!file_exists($qrCodePath)) {
                        return response()->json(['error' => 'QR code generation failed'], 500);
                    }

                    $qrImage = Image::make($qrCodePath)->resize(round($item['size'] * 2.5), round($item['size'] * 2.5));
                    $img->insert($qrImage, 'top-left', round($item['position']['x'] * 2.5), round($item['position']['y'] * 2.5) + $yPlus);

                    unlink($qrCodePath);
                }
            }

            $fileName = strtolower(str_replace(' ', '_', $data['name'])) . '.png';
            $filePath = $outputDir . '/' . $fileName;
            $img->save($filePath);

            $images[] = $filePath;
        }

        // Create ZIP file
            $zipFileName = str_replace(' ', '_', $event->name) . '_generated_images_' . ($offset + 1) . '-' . ($offset + 50) . '.zip';
            $zipPath = public_path($zipFileName);

            $zip = new \ZipArchive();
            if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
                foreach ($images as $file) {
                    $relativeName = basename($file);
                    $zip->addFile($file, $relativeName);
                }
                $zip->close();
            }
            
            // Delete generated images after zipping
            foreach ($images as $file) {
                if (file_exists($file)) {
                    unlink($file);
                }
            }


            return response()->json([
                'zip_url' => url($zipFileName)
            ]);
    }

    /**
     * Helper function to measure text width dynamically.
     */
    private function getTextWidth($text, $fontSize, $fontPath)
    {
        $box = imagettfbbox($fontSize, 0, $fontPath, $text);
        return abs($box[4] - $box[0]);
    }
}
