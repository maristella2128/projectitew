<?php

namespace App\Exports;

use App\Models\Student;
use App\Models\Section;
use App\Models\Attendance;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Carbon\Carbon;
use Illuminate\Support\Str;

class MonthlyAttendanceExport implements FromView, WithTitle, ShouldAutoSize
{
    protected $sectionId;
    protected $month;

    public function __construct($sectionId, $month)
    {
        $this->sectionId = $sectionId;
        $this->month = $month; // format: YYYY-MM
    }

    public function view(): View
    {
        $section = Section::with('program')->findOrFail($this->sectionId);
        $date = Carbon::parse($this->month . '-01');
        $daysInMonth = $date->daysInMonth;
        $today = Carbon::today();
        
        $students = Student::where('section_id', $this->sectionId)
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        $attendanceRecords = Attendance::whereIn('student_id', $students->pluck('id'))
            ->whereYear('date', $date->year)
            ->whereMonth('date', $date->month)
            ->get();

        $attendanceData = [];
        $summaries = [];

        foreach ($students as $student) {
            $summaries[$student->id] = ['p' => 0, 'a' => 0, 'l' => 0, 'e' => 0];
        }

        foreach ($attendanceRecords as $record) {
            $dateStr = $record->date->format('Y-m-d');
            $status = Str::lower($record->status);
            
            // Store mapping for grid display
            $attendanceData[$record->student_id][$dateStr] = $status;

            // Stats calculation: Only count if date is today or earlier
            if ($record->date->lte($today)) {
                if ($status === 'present') $summaries[$record->student_id]['p']++;
                if ($status === 'absent') $summaries[$record->student_id]['a']++;
                if ($status === 'late') $summaries[$record->student_id]['l']++;
                if ($status === 'excused') $summaries[$record->student_id]['e']++;
            }
        }

        $days = range(1, $daysInMonth);

        return view('exports.attendance_export', [
            'section' => $section,
            'students' => $students,
            'days' => $days,
            'month' => $this->month,
            'attendanceData' => $attendanceData,
            'summaries' => $summaries,
            'today' => $today
        ]);
    }

    public function title(): string
    {
        return 'Attendance - ' . $this->month;
    }
}
