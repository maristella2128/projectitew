<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\SpaRouting as Inertia;

class HealthRecordController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = HealthRecord::with([
            'student.user', 'creator',
            'consultation', 'certificate', 'immunization',
            'incident', 'screening', 'allergy',
        ]);

        // Role-based scoping
        if ($user->role === 'professor') {
            $query->forProfessor();
        } elseif ($user->role === 'student') {
            $student = $user->student;
            if (!$student) {
                return Inertia::render('HealthRecords/Index', [
                    'records'  => ['data' => []],
                    'students' => [],
                    'stats'    => null,
                    'userRole' => $user->role,
                    'filters'  => [],
                ]);
            }
            $query->forStudent($student->id);
        }
        // Dean sees everything

        // Filters
        if ($request->filled('record_type') && $request->record_type !== 'all') {
            $query->where('record_type', $request->record_type);
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->filled('academic_block')) {
            $query->where('academic_block', $request->academic_block);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('record_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('record_date', '<=', $request->date_to);
        }

        $records = $query->latest('record_date')->paginate(16);

        // Dashboard stats (dean only)
        $stats = null;
        if ($user->role === 'dean') {
            $stats = [
                'total'          => HealthRecord::count(),
                'active_incidents'=> HealthRecord::where('record_type', 'incident')
                                                 ->where('status', 'active')->count(),
                'certs_issued'   => HealthRecord::where('record_type', 'medical_certificate')->count(),
                'due_screening'  => HealthRecord::where('record_type', 'health_screening')
                                                ->whereHas('screening', fn($q) =>
                                                    $q->where('clearance_status', 'pending')
                                                )->count(),
            ];
        }

        $students = $user->role !== 'student'
            ? Student::with('user')->get()->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->user->name,
                'student_id' => $s->student_id,
            ])
            : collect();

        return Inertia::render('HealthRecords/Index', [
            'records'  => $records,
            'students' => $students,
            'stats'    => $stats,
            'userRole' => $user->role,
            'filters'  => $request->only([
                'record_type', 'student_id', 'academic_block', 'status', 'date_from', 'date_to'
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $base = $request->validate([
            'student_id'     => 'required|exists:students,id',
            'record_type'    => 'required|in:consultation,medical_certificate,immunization,incident,health_screening,allergy_condition',
            'status'         => 'required|in:active,resolved,expired,flagged',
            'academic_block' => 'nullable|string',
            'notes'          => 'nullable|string',
            'record_date'    => 'required|date',
            'follow_up_date' => 'nullable|date|after_or_equal:record_date',
        ]);

        // Type-specific validation rules
        $typeRules = match($request->record_type) {
            'consultation' => [
                'detail.chief_complaint'        => 'required|string',
                'detail.symptoms'               => 'nullable|string',
                'detail.vital_signs'            => 'nullable|array',
                'detail.diagnosis'              => 'nullable|string',
                'detail.icd_code'               => 'nullable|string|max:20',
                'detail.prescribed_medication'  => 'nullable|string',
                'detail.attending_physician'    => 'nullable|string',
            ],
            'medical_certificate' => [
                'detail.certificate_type' => 'required|in:sick_leave,fit_to_return,fit_for_pe,general',
                'detail.condition_start'  => 'required|date',
                'detail.condition_end'    => 'required|date|after_or_equal:detail.condition_start',
                'detail.issued_date'      => 'required|date',
                'detail.issued_by'        => 'required|string',
            ],
            'immunization' => [
                'detail.vaccine_name'       => 'required|string',
                'detail.brand'              => 'nullable|string',
                'detail.dose_number'        => 'required|in:1st,2nd,3rd,booster,annual',
                'detail.date_administered'  => 'required|date',
                'detail.next_due_date'      => 'nullable|date',
                'detail.administered_by'    => 'nullable|string',
                'detail.lot_number'         => 'nullable|string',
            ],
            'incident' => [
                'detail.incident_type'        => 'required|in:accident,sports_injury,fainting,allergic_reaction,other',
                'detail.location_on_campus'   => 'required|string',
                'detail.first_aid_given'      => 'required|string',
                'detail.referred_to_hospital' => 'boolean',
                'detail.hospital_name'        => 'nullable|string',
                'detail.witness_name'         => 'nullable|string',
                'detail.severity'             => 'required|in:minor,moderate,major',
            ],
            'health_screening' => [
                'detail.school_year'       => 'required|string',
                'detail.semester'          => 'required|in:1st,2nd,summer',
                'detail.height_cm'         => 'nullable|numeric',
                'detail.weight_kg'         => 'nullable|numeric',
                'detail.vision_result'     => 'nullable|string',
                'detail.hearing_result'    => 'nullable|string',
                'detail.blood_type'        => 'nullable|string',
                'detail.dental_status'     => 'nullable|in:good,needs_attention,treated',
                'detail.clearance_status'  => 'required|in:cleared,flagged,pending',
            ],
            'allergy_condition' => [
                'detail.allergy_type'                => 'required|string',
                'detail.allergen'                    => 'required|string',
                'detail.severity'                    => 'required|in:mild,moderate,severe,life_threatening',
                'detail.chronic_illness'             => 'nullable|string',
                'detail.emergency_medication'        => 'nullable|string',
                'detail.emergency_contact_name'      => 'nullable|string',
                'detail.emergency_contact_phone'     => 'nullable|string',
                'detail.show_alert_to_professors'    => 'boolean',
            ],
        };

        $request->validate($typeRules);

        DB::transaction(function () use ($request, $base) {
            $record = HealthRecord::create([
                ...$base,
                'created_by' => auth()->id(),
            ]);

            // Create the sub-record
            $detailData = $request->input('detail', []);

            match($request->record_type) {
                'consultation'        => $record->consultation()->create($detailData),
                'medical_certificate' => $record->certificate()->create($detailData),
                'immunization'        => $record->immunization()->create($detailData),
                'incident'            => $record->incident()->create($detailData),
                'health_screening'    => $record->screening()->create($detailData),
                'allergy_condition'   => $record->allergy()->create($detailData),
            };
        });

        session()->flash('success', 'Health record created.');
        return Inertia::location(route('health.index'));
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        // Gate: professor and student cannot update
        if (in_array(auth()->user()->role, ['professor', 'student'])) {
            abort(403);
        }

        DB::transaction(function () use ($request, $healthRecord) {
            $healthRecord->update($request->only([
                'status', 'academic_block', 'notes', 'record_date', 'follow_up_date'
            ]));

            if ($request->has('detail')) {
                $healthRecord->detail()?->update($request->input('detail'));
            }
        });

        session()->flash('success', 'Record updated.');
        return Inertia::location(route('health.index'));
    }

    public function destroy(HealthRecord $healthRecord)
    {
        if (auth()->user()->role !== 'dean') abort(403);
        $healthRecord->delete();
        session()->flash('success', 'Record removed.');
        return Inertia::location(route('health.index'));
    }
}
