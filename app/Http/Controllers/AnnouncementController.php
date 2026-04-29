<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Helpers\SpaRouting as Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Announcement::class);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $filters = $request->only(['type', 'section_id', 'search', 'tab']);
        $tab = $filters['tab'] ?? 'live';
        
        $query = Announcement::with(['author', 'section'])->withCount('reads');

        // Analytics Data
        $totalSent = Announcement::whereIn('status', ['published', 'archived'])->count();
        $activeRecipients = Student::count();
        
        // Calculate Avg Open Rate (naive implementation for demo)
        $totalReads = \DB::table('announcement_reads')->count();
        $avgOpenRate = $totalSent > 0 && $activeRecipients > 0 
            ? round(($totalReads / ($totalSent * $activeRecipients)) * 100, 1) 
            : 0;

        $pendingReads = 0;
        if ($user->hasRole(['student'])) {
            $student = Student::where('user_id', $user->id)->first();
            if ($student) {
                // Announcements they haven't read
                $readIds = $student->readAnnouncements()->pluck('announcements.id')->toArray();
                $pendingReads = Announcement::where('status', 'published')
                    ->where(function($q) {
                        $q->whereNull('scheduled_at')->orWhere('scheduled_at', '<=', now());
                    })
                    ->whereNotIn('id', $readIds)->count();
            }
        }

        // Tab Filtering
        switch ($tab) {
            case 'scheduled':
                $query->where('status', 'published')->where('scheduled_at', '>', now());
                break;
            case 'drafts':
                $query->where('status', 'draft');
                break;
            case 'archive':
                $query->where('status', 'archived');
                break;
            case 'live':
            default:
                $query->where('status', 'published')
                      ->where(function($q) {
                          $q->whereNull('scheduled_at')->orWhere('scheduled_at', '<=', now());
                      });
                break;
        }

        // Search
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('content', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Universal Filters
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        if (!empty($filters['section_id'])) {
            // For now, mapping old section_id behavior, plus target_audience if needed
            $query->where(function($q) use ($filters) {
                $q->where('section_id', $filters['section_id'])
                  ->orWhereJsonContains('target_audience->sections', (int)$filters['section_id']);
            });
        }

        // Students/Parents only see relevant announcements
        if ($user->hasRole(['student', 'parent'])) {
            $student = Student::where('user_id', $user->id)->first();
            /** @var \Illuminate\Database\Eloquent\Builder $query */
            $query->where(function($q) use ($student) {
                /** @var \Illuminate\Database\Eloquent\Builder $q */
                $q->whereNull('section_id')
                  ->orWhere('section_id', $student?->section_id)
                  ->orWhereNull('target_audience')
                  ->orWhereJsonContains('target_audience->sections', $student?->section_id);
            });
        }

        // Sort: pinned first for live feed, then latest
        if ($tab === 'live') {
            $query->orderBy('is_pinned', 'desc')->latest();
        } else {
            $query->latest();
        }

        $announcements = $query->paginate(10)->withQueryString();
        
        // Append read rates and current user's read status
        $studentId = $user->hasRole(['student']) ? Student::where('user_id', $user->id)->value('id') : null;
        
        $announcements->getCollection()->transform(function ($announcement) use ($activeRecipients, $studentId) {
            $announcement->read_rate = $activeRecipients > 0 ? round(($announcement->reads_count / $activeRecipients) * 100) : 0;
            if ($studentId) {
                $announcement->has_read = \DB::table('announcement_reads')
                    ->where('announcement_id', $announcement->id)
                    ->where('student_id', $studentId)
                    ->exists();
            }
            return $announcement;
        });

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'sections' => Section::all(),
            'filters' => $filters,
            'analytics' => [
                'totalSent' => $totalSent,
                'avgOpenRate' => $avgOpenRate,
                'pendingReads' => $pendingReads,
                'activeRecipients' => $activeRecipients,
            ]
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Announcement::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:general,academic,urgent,health',
            'section_id' => 'nullable|exists:sections,id',
            'target_audience' => 'nullable|array',
            'scheduled_at' => 'nullable|date',
            'is_pinned' => 'boolean',
            'status' => 'required|in:draft,published,archived',
        ]);

        Announcement::create(array_merge($validated, [
            'user_id' => Auth::id(),
            'is_pinned' => $request->boolean('is_pinned'),
        ]));

        return redirect()->back()->with('success', 'Announcement saved successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        Gate::authorize('delete', $announcement);
        $announcement->delete();
        return redirect()->back()->with('success', 'Announcement removed.');
    }
    
    public function markAsRead(Announcement $announcement)
    {
        $user = Auth::user();
        if ($user->hasRole(['student'])) {
            $student = Student::where('user_id', $user->id)->first();
            if ($student) {
                $student->readAnnouncements()->syncWithoutDetaching([
                    $announcement->id => ['read_at' => now()]
                ]);
            }
        }
        
        return response()->json(['success' => true]);
    }
    
    public function readReceipts(Announcement $announcement)
    {
        Gate::authorize('viewAny', Announcement::class);
        
        $reads = $announcement->reads()->with('section')->get();
        // Get all active students
        $allStudents = Student::with('section')->get();
        
        $readIds = $reads->pluck('id')->toArray();
        $unread = $allStudents->whereNotIn('id', $readIds)->values();
        
        return response()->json([
            'read' => $reads,
            'unread' => $unread
        ]);
    }

    public function latest()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user) return response()->json([]);
        
        $query = Announcement::with(['author'])
            ->where('status', 'published')
            ->where(function($q) {
                $q->whereNull('scheduled_at')->orWhere('scheduled_at', '<=', now());
            });

        if ($user->hasRole(['student', 'parent'])) {
            $student = Student::where('user_id', $user->id)->first();
            $query->where(function($q) use ($student) {
                $q->whereNull('section_id')
                  ->orWhere('section_id', $student?->section_id)
                  ->orWhereNull('target_audience')
                  ->orWhereJsonContains('target_audience->sections', $student?->section_id);
            });
        }

        $latest = $query->orderBy('is_pinned', 'desc')->latest()->limit(5)->get();
        
        // Add read status
        $studentId = $user->hasRole(['student']) ? Student::where('user_id', $user->id)->value('id') : null;
        if ($studentId) {
            $readIds = \DB::table('announcement_reads')
                ->where('student_id', $studentId)
                ->whereIn('announcement_id', $latest->pluck('id'))
                ->pluck('announcement_id')
                ->toArray();
            
            $latest->transform(function($ann) use ($readIds) {
                $ann->has_read = in_array($ann->id, $readIds);
                return $ann;
            });
        }

        return response()->json($latest);
    }
}
