<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClearanceDepartment;
use App\Models\StudentClearanceEntry;
use App\Models\Student;
use App\Services\ConductScoringService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClearanceController extends Controller
{
    public function show(Student $student, Request $request)
    {
        $semester = $request->semester ?? 1;
        $year = $request->academic_year ?? '2024-2025';

        $entries = StudentClearanceEntry::with('department')
            ->where('student_id', $student->id)
            ->where('semester', $semester)
            ->where('academic_year', $year)
            ->get();

        if ($entries->isEmpty()) {
            return $this->initialize($student, $request);
        }

        return response()->json([
            'overall_status' => $this->getOverallStatus($entries),
            'cleared_count' => $entries->where('status', 'cleared')->count(),
            'total_departments' => $entries->count(),
            'departments' => $entries->map(fn($e) => [
                'id' => $e->id,
                'dept_name' => $e->department?->name ?? 'Unknown',
                'status' => $e->status,
                'note' => $e->note,
                'hold_reason' => $e->hold_reason,
                'cleared_by_name' => $e->cleared_by ? \App\Models\User::find($e->cleared_by)?->name : null,
                'cleared_at' => $e->cleared_at
            ])
        ]);
    }

    public function initialize(Student $student, Request $request)
    {
        $semester = $request->semester ?? 1;
        $year = $request->academic_year ?? '2024-2025';

        $depts = ClearanceDepartment::orderBy('display_order')->get();
        if ($depts->isEmpty()) {
            $this->seedDepts();
            $depts = ClearanceDepartment::orderBy('display_order')->get();
        }

        foreach ($depts as $dept) {
            StudentClearanceEntry::firstOrCreate([
                'student_id' => $student->id,
                'department_id' => $dept->id,
                'semester' => $semester,
                'academic_year' => $year
            ]);
        }

        return $this->show($student, $request);
    }

    public function markCleared($id)
    {
        $entry = StudentClearanceEntry::findOrFail($id);
        $entry->update([
            'status' => 'cleared',
            'cleared_by' => Auth::id(),
            'cleared_at' => now()
        ]);

        // Connect to overall clearance management
        $service = app(ConductScoringService::class);
        $service->evaluateClearanceForStudent($entry->student);

        return response()->json(['success' => true]);
    }

    public function markOnHold(Request $request, $id)
    {
        $entry = StudentClearanceEntry::findOrFail($id);
        $entry->update([
            'status' => 'on_hold',
            'hold_reason' => $request->reason,
            'note' => $request->note
        ]);

        // Connect to overall clearance management
        $service = app(ConductScoringService::class);
        $service->evaluateClearanceForStudent($entry->student);

        return response()->json(['success' => true]);
    }

    public function revoke(Request $request, $id)
    {
        $entry = StudentClearanceEntry::findOrFail($id);
        $entry->update([
            'status' => 'pending',
            'revoked_by' => Auth::id(),
            'revoked_at' => now(),
            'revoke_reason' => $request->reason,
            'cleared_by' => null,
            'cleared_at' => null
        ]);

        // Connect to overall clearance management
        $service = app(ConductScoringService::class);
        $service->evaluateClearanceForStudent($entry->student);

        return response()->json(['success' => true]);
    }

    private function getOverallStatus($entries)
    {
        if ($entries->contains('status', 'on_hold')) return 'on_hold';
        if ($entries->every('status', 'cleared')) return 'fully_cleared';
        return 'pending';
    }

    private function seedDepts()
    {
        $defaultDepts = [
            ['name' => 'Library', 'blocks_enrollment' => true],
            ['name' => 'Laboratory', 'blocks_enrollment' => true],
            ['name' => 'Accounting', 'blocks_enrollment' => true],
            ['name' => 'Registrar', 'blocks_tor' => true],
            ['name' => 'Dean\'s Office', 'blocks_enrollment' => true],
            ['name' => 'Adviser', 'blocks_enrollment' => true],
            ['name' => 'Guidance Office', 'blocks_enrollment' => true],
        ];

        foreach ($defaultDepts as $idx => $dept) {
            ClearanceDepartment::create(array_merge($dept, ['display_order' => $idx]));
        }
    }
}
