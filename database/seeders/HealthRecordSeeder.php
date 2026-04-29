<?php

namespace Database\Seeders;

use App\Models\HealthRecord;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HealthRecordSeeder extends Seeder
{
    public function run(): void
    {
        $dean = User::where('role', 'dean')->first();
        if (!$dean) return;

        $students = Student::take(5)->get();
        if ($students->isEmpty()) return;

        // 1. Consultation
        $record1 = HealthRecord::create([
            'student_id'     => $students[0]->id,
            'created_by'     => $dean->id,
            'record_type'    => 'consultation',
            'status'         => 'active',
            'academic_block' => '2024-2025 1st Sem',
            'notes'          => 'Patient reports recurring headaches.',
            'record_date'    => now(),
        ]);
        $record1->consultation()->create([
            'chief_complaint' => 'Headache and fever',
            'symptoms'        => 'High temperature, nausea',
            'vital_signs'     => ['blood_pressure' => '120/80', 'temperature' => '38.5', 'heart_rate' => '88', 'weight' => '65'],
            'diagnosis'       => 'Common Flu',
            'attending_physician' => 'Dr. Santos',
        ]);

        // 2. Medical Certificate
        $record2 = HealthRecord::create([
            'student_id'     => $students[0]->id,
            'created_by'     => $dean->id,
            'record_type'    => 'medical_certificate',
            'status'         => 'active',
            'academic_block' => '2024-2025 1st Sem',
            'record_date'    => now(),
        ]);
        $record2->certificate()->create([
            'certificate_type' => 'sick_leave',
            'condition_start'  => now()->subDays(2),
            'condition_end'    => now()->addDays(1),
            'issued_date'      => now(),
            'issued_by'        => 'Dr. Santos',
        ]);

        // 3. Immunization
        $record3 = HealthRecord::create([
            'student_id'     => $students[1]->id,
            'created_by'     => $dean->id,
            'record_type'    => 'immunization',
            'status'         => 'active',
            'academic_block' => '2024-2025 1st Sem',
            'record_date'    => now()->subMonths(6),
        ]);
        $record3->immunization()->create([
            'vaccine_name'      => 'COVID-19 Booster',
            'brand'             => 'Pfizer',
            'dose_number'       => 'booster',
            'date_administered' => now()->subMonths(6),
            'administered_by'   => 'Nurse Reyes',
        ]);

        // 4. Incident
        $record4 = HealthRecord::create([
            'student_id'     => $students[2]->id,
            'created_by'     => $dean->id,
            'record_type'    => 'incident',
            'status'         => 'resolved',
            'academic_block' => '2024-2025 1st Sem',
            'record_date'    => now()->subDays(10),
        ]);
        $record4->incident()->create([
            'incident_type'      => 'sports_injury',
            'location_on_campus' => 'Gymnasium',
            'first_aid_given'    => 'Ice pack and elevation',
            'severity'           => 'minor',
            'witness_name'       => 'Coach Mike',
        ]);

        // 5. Health Screening
        $record5 = HealthRecord::create([
            'student_id'     => $students[0]->id,
            'created_by'     => $dean->id,
            'record_type'    => 'health_screening',
            'status'         => 'active',
            'academic_block' => '2024-2025 1st Sem',
            'record_date'    => now()->subMonths(2),
        ]);
        $record5->screening()->create([
            'school_year'      => '2024-2025',
            'semester'         => '1st',
            'height_cm'        => 170,
            'weight_kg'        => 60,
            'vision_result'    => '20/20',
            'clearance_status' => 'cleared',
        ]);

        // 6. Allergy Condition
        $record6 = HealthRecord::create([
            'student_id'     => $students[1]->id,
            'created_by'     => $dean->id,
            'record_type'    => 'allergy_condition',
            'status'         => 'flagged',
            'academic_block' => '2024-2025 1st Sem',
            'record_date'    => now(),
        ]);
        $record6->allergy()->create([
            'allergy_type'             => 'Drug',
            'allergen'                 => 'Penicillin',
            'severity'                 => 'severe',
            'show_alert_to_professors' => true,
            'emergency_contact_name'   => 'Juan Dela Cruz',
            'emergency_contact_phone'  => '09123456789',
        ]);
    }
}
