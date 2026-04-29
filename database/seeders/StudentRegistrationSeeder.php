<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Section;
use App\Models\Program;
use Carbon\Carbon;

class StudentRegistrationSeeder extends Seeder
{
    // ── Students actual columns (verified via DESCRIBE students) ──────────────
    // id, registration_code, registration_code_used, registration_code_expires_at,
    // user_id, candidate_id, section_id, student_id (= renamed lrn, NOT NULL, unique),
    // first_name, last_name, middle_name, birthdate, gender, address, photo,
    // guardian_name, guardian_contact, guardian_relationship, course, major,
    // year_level (tinyInt 1-4), academic_status, enrollment_status, skills,
    // activities, total_engagement_points, school_year, deleted_at, timestamps
    //
    // NOTE: `student_id` is the old `lrn` column (renamed in 2026_03_19 migration).
    //       It is NOT NULL and unique — we generate a 12-digit numeric string.

    // ── FILIPINO NAME POOLS ───────────────────────────────────────────────────

    private array $maleFirstNames = [
        'Juan', 'Jose', 'Carlo', 'Miguel', 'Rafael', 'Luis', 'Marco', 'Angelo',
        'Gabriel', 'Daniel', 'Christian', 'Mark', 'John', 'Paul', 'James',
        'Patrick', 'Francis', 'Jerome', 'Kenneth', 'Rodel', 'Arvin', 'Dante',
        'Eduardo', 'Ferdinand', 'Gilbert', 'Harley', 'Ivan', 'Jasper', 'Kevin',
        'Lester', 'Manuel', 'Nathan', 'Oscar', 'Peter', 'Ramon', 'Samuel',
        'Timothy', 'Victor', 'Warren', 'Aldrin', 'Benjo', 'Crisanto', 'Danilo',
        'Efren', 'Florante', 'Gerry', 'Hernando', 'Jonathan', 'Kristoffer',
        'Leonardo', 'Marvin', 'Nestor', 'Orlando', 'Renato', 'Sherwin',
        'Teodoro', 'Valentino', 'Wilfredo', 'Alvin', 'Bryan', 'Chester',
        'Dennis', 'Eugene', 'Felix', 'George', 'Henry', 'Ian', 'Jeffrey',
        'Karl', 'Larry', 'Michael', 'Neil', 'Oliver', 'Perry', 'Richard',
        'Steve', 'Thomas', 'Ulysses', 'Vincent', 'Wesley', 'Alex', 'Ben',
        'Carl', 'Dave', 'Eric', 'Frank', 'Greg', 'Harry', 'Irwin', 'Jason',
    ];

    private array $femaleFirstNames = [
        'Maria', 'Ana', 'Rosa', 'Elena', 'Sofia', 'Isabella', 'Gabriela',
        'Valentina', 'Camila', 'Lucia', 'Andrea', 'Patricia', 'Jennifer',
        'Michelle', 'Christine', 'Katherine', 'Stephanie', 'Amanda', 'Jessica',
        'Ashley', 'Kristine', 'Maricel', 'Rowena', 'Cynthia', 'Lourdes',
        'Teresita', 'Corazon', 'Marilou', 'Josefina', 'Remedios', 'Erlinda',
        'Norma', 'Rosario', 'Carmelita', 'Felicitas', 'Adoracion', 'Milagros',
        'Annaliza', 'Blesilda', 'Charlyn', 'Danica', 'Erica', 'Faith',
        'Grace', 'Hannah', 'Iris', 'Janelle', 'Karen', 'Lovely', 'Mary',
        'Nathalie', 'Olive', 'Pamela', 'Rachel', 'Sandra', 'Tricia',
        'Vanessa', 'Wendy', 'Abigail', 'Beatrice', 'Clara', 'Diana',
        'Elaine', 'Fiona', 'Gloria', 'Helen', 'Irene', 'Julia', 'Katrina',
        'Lisa', 'Monica', 'Nina', 'Ophelia', 'Priscilla', 'Queenie', 'Rita',
        'Sheila', 'Tina', 'Ursula', 'Vivian', 'Yolanda', 'Zaira',
    ];

    private array $lastNames = [
        'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza',
        'Torres', 'Flores', 'Gonzales', 'Lopez', 'Martinez', 'Ramirez', 'Ramos',
        'Aquino', 'Castillo', 'Villanueva', 'Fernandez', 'Domingo', 'Pascual',
        'Aguilar', 'Castro', 'Navarro', 'Morales', 'Jimenez', 'Herrera',
        'Medina', 'Espino', 'Robles', 'Vargas', 'Salazar', 'Guevara',
        'Guerrero', 'Mercado', 'Estrada', 'Soriano', 'Velasco', 'Tolentino',
        'Macaraeg', 'Dizon', 'Enriquez', 'Manalo', 'Abad', 'Abella',
        'Acosta', 'Advincula', 'Aguirre', 'Alcantara', 'Alcaraz', 'Alegre',
        'Alejandro', 'Alejo', 'Alvarado', 'Alvarez', 'Amador', 'Ambrosio',
        'Andres', 'Antonio', 'Apostol', 'Aragon', 'Arellano', 'Arguelles',
        'Arias', 'Ariola', 'Arroyo', 'Austria', 'Avila', 'Ayala', 'Bacani',
        'Ballesteros', 'Baltazar', 'Baluyot', 'Banzon', 'Barreto', 'Barrios',
        'Batista', 'Bello', 'Bernardo', 'Bonifacio', 'Borja', 'Brillantes',
        'Buenaventura', 'Bueno', 'Burgos', 'Cabral', 'Cabrera', 'Calderon',
        'Calixto', 'Camacho', 'Campos', 'Canlas', 'Cano', 'Capistrano',
        'Carpio', 'Carreon', 'Casimiro', 'Catalan', 'Cayabyab', 'Chua',
    ];

    private array $middleNames = [
        'Santos', 'Reyes', 'Cruz', 'Garcia', 'Lopez', 'Torres', 'Flores',
        'Ramos', 'Aquino', 'Castillo', 'Fernandez', 'Pascual', 'Aguilar',
        'Morales', 'Espino', 'Robles', 'Vargas', 'Salazar', 'Mercado',
        'Velasco', 'Dizon', 'Manalo', 'Abad', 'Acosta', 'Alcantara',
        'Alegre', 'Alvarez', 'Antonio', 'Aragon', 'Austria', 'Avila',
        'Bacani', 'Baltazar', 'Bernardo', 'Bonifacio', 'Bueno', 'Cabrera',
    ];

    private array $guardianFirstNames = [
        'Roberto', 'Antonio', 'Eduardo', 'Fernando', 'Gregorio', 'Herminio',
        'Ireneo', 'Jacinto', 'Leandro', 'Marcelo', 'Narciso', 'Perfecto',
        'Rodrigo', 'Severino', 'Teodosio', 'Urbano', 'Victorino', 'Zacarias',
        'Lourdes', 'Teresita', 'Corazon', 'Josefina', 'Remedios', 'Erlinda',
        'Norma', 'Rosario', 'Carmelita', 'Milagros', 'Celeste', 'Divina',
    ];

    private array $relationships = [
        'Father', 'Mother', 'Guardian', 'Uncle', 'Aunt',
        'Grandfather', 'Grandmother', 'Elder Sibling',
    ];

    private array $skills = [
        'Programming', 'Web Design', 'Technical Writing', 'Hardware Repair',
        'Networking', 'Cybersecurity',
    ];

    private array $activities = [
        'Hackathons', 'IT Society', 'E-Sports', 'Research Club', 'Robotics',
    ];

    private array $academicStatuses = [
        'regular', 'regular', 'regular', 'irregular', 'probation',
    ];

    private array $barangays = [
        'Bagong Nayon', 'San Jose', 'Santa Cruz', 'Poblacion', 'Magsaysay',
        'Rizal', 'Bonifacio', 'Mabini', 'Del Pilar', 'Quezon',
        'Malvar', 'Luna', 'Burgos', 'Aguinaldo', 'Jacinto',
    ];

    private array $cities = [
        'Cainta', 'Antipolo', 'Taytay', 'Angono', 'Binangonan',
        'Morong', 'Baras', 'Tanay', 'Cardona', 'Pililla',
    ];

    // year_level is a tinyInteger (1-4) in students table
    private array $yearLevelLabels = [
        1 => '1st Year',
        2 => '2nd Year',
        3 => '3rd Year',
        4 => '4th Year',
    ];

    // ── ENTRY POINT ───────────────────────────────────────────────────────────

    public function run(): void
    {
        $sections = Section::all();
        $programs = Program::all();

        if ($sections->isEmpty()) {
            $this->command->error('No sections found. Please seed sections first.');
            return;
        }

        if ($programs->isEmpty()) {
            $this->command->error('No programs found. Please seed programs first.');
            return;
        }

        $total      = 980;
        $created    = 0;
        $skipped    = 0;
        $now        = now()->toDateTimeString();
        $schoolYear = '2025-2026';

        // Pre-load existing values into memory for fast uniqueness checks
        $usedEmails     = DB::table('users')->pluck('email')->flip()->toArray();
        $usedRegCodes   = DB::table('candidates')->pluck('registration_code')->flip()->toArray();
        $usedStudentIds = DB::table('students')->pluck('student_id')->filter()->flip()->toArray();

        // Also block reg codes already in students table
        DB::table('students')->whereNotNull('registration_code')
            ->pluck('registration_code')
            ->each(fn ($c) => $usedRegCodes[$c] = true);

        // Also block user_ids already in students
        $usedUserIds = DB::table('students')->pluck('user_id')->flip()->toArray();

        // Look up student role once
        $studentRole = DB::table('roles')->where('name', 'student')->first();

        $this->command->info("Seeding {$total} students via the candidate registration flow...");
        $bar = $this->command->getOutput()->createProgressBar($total);
        $bar->start();

        for ($i = 1; $i <= $total; $i++) {
            // ── Names ──────────────────────────────────────────────────────
            $gender    = fake()->randomElement(['male', 'female']);
            $firstName = fake()->randomElement(
                $gender === 'male' ? $this->maleFirstNames : $this->femaleFirstNames
            );
            $lastName   = fake()->randomElement($this->lastNames);
            $middleName = fake()->randomElement($this->middleNames);

            // ── Unique email ───────────────────────────────────────────────
            $email   = null;
            $attempt = 0;
            do {
                $suffix = $attempt === 0
                    ? fake()->numberBetween(1, 99999)
                    : ($i * 1000 + $attempt);
                $email = strtolower(
                    preg_replace('/\s+/', '', $firstName) . '.' .
                    preg_replace('/[\s\']+/', '', $lastName) .
                    $suffix . '@gmail.com'
                );
                $attempt++;
            } while (isset($usedEmails[$email]));
            $usedEmails[$email] = true;

            // ── Unique REG code ────────────────────────────────────────────
            $regCode = null;
            do {
                $regCode = 'REG-' . strtoupper(fake()->lexify('????'));
            } while (isset($usedRegCodes[$regCode]));
            $usedRegCodes[$regCode] = true;

            // ── Unique student_id (12-digit numeric string, was `lrn`) ────────
            $studentId = null;
            do {
                $studentId = (string) fake()->numerify('############');
            } while (isset($usedStudentIds[$studentId]));
            $usedStudentIds[$studentId] = true;

            // ── Academic placement ─────────────────────────────────────────
            $section        = $sections->random();
            $program        = $programs->random();
            $yearLevelInt   = fake()->numberBetween(1, 4);
            $yearLevelLabel = $this->yearLevelLabels[$yearLevelInt];
            $academicStatus = fake()->randomElement($this->academicStatuses);

            // ── Guardian ───────────────────────────────────────────────────
            $guardianName  = fake()->randomElement($this->guardianFirstNames)
                           . ' ' . fake()->randomElement($this->lastNames);
            $relationship  = fake()->randomElement($this->relationships);
            $contactNumber = '09' . fake()->numerify('#########');

            // ── Address ────────────────────────────────────────────────────
            $address = 'Blk ' . fake()->numberBetween(1, 200)
                     . ' Lot ' . fake()->numberBetween(1, 30)
                     . ' ' . fake()->randomElement($this->barangays)
                     . ', ' . fake()->randomElement($this->cities)
                     . ', Rizal';

            // ── Skills & Activities (must match enum values in form) ────────
            $selectedSkills     = fake()->randomElements($this->skills,    fake()->numberBetween(1, 4));
            $selectedActivities = fake()->randomElements($this->activities, fake()->numberBetween(1, 3));

            // ── Dates ──────────────────────────────────────────────────────
            $birthdate    = fake()->dateTimeBetween('-25 years', '-17 years')->format('Y-m-d');
            $createdAt    = fake()->dateTimeBetween('-2 years', '-1 month')->format('Y-m-d H:i:s');
            $submittedAt  = Carbon::parse($createdAt)->addDays(fake()->numberBetween(1, 30))->toDateTimeString();
            $codeExpires  = Carbon::parse($createdAt)->addDays(30)->toDateTimeString();

            try {
                DB::transaction(function () use (
                    $firstName, $lastName, $middleName, $email, $regCode, $studentId,
                    $gender, $birthdate, $address, $guardianName, $relationship,
                    $contactNumber, $section, $program,
                    $yearLevelInt, $yearLevelLabel, $academicStatus, $schoolYear,
                    $selectedSkills, $selectedActivities,
                    $createdAt, $submittedAt, $codeExpires, $now,
                    $studentRole, &$created, &$usedUserIds
                ) {
                    // ── STEP 1: User account ───────────────────────────────
                    $userId = DB::table('users')->insertGetId([
                        'name'              => $firstName . ' ' . $lastName,
                        'email'             => $email,
                        'password'          => Hash::make('password'),
                        'email_verified_at' => $now,
                        'created_at'        => $createdAt,
                        'updated_at'        => $now,
                    ]);

                    // Assign Spatie student role
                    if ($studentRole) {
                        DB::table('model_has_roles')->insert([
                            'role_id'    => $studentRole->id,
                            'model_type' => 'App\\Models\\User',
                            'model_id'   => $userId,
                        ]);
                    }

                    // ── STEP 2: Candidate (simulates admin issuing REG code) ──
                    $formData = json_encode([
                        'first_name'            => $firstName,
                        'last_name'             => $lastName,
                        'middle_name'           => $middleName,
                        'birthdate'             => $birthdate,
                        'gender'                => $gender,
                        'address'               => $address,
                        'guardian_name'         => $guardianName,
                        'guardian_contact'      => $contactNumber,
                        'guardian_relationship' => $relationship,
                        'section_id'            => $section->id,
                        'skills'                => $selectedSkills,
                        'activities'            => $selectedActivities,
                        'submitted_at'          => $submittedAt,
                    ]);

                    $candidateId = DB::table('candidates')->insertGetId([
                        'first_name'                   => $firstName,
                        'last_name'                    => $lastName,
                        'email'                        => $email,
                        'phone'                        => $contactNumber,
                        'year_level_applied'           => $yearLevelLabel,
                        'strand'                       => null,
                        'registration_code'            => $regCode,
                        'registration_code_used'       => true,
                        'registration_code_expires_at' => $codeExpires,
                        'status'                       => 'enrolled',
                        'form_submitted_at'            => $submittedAt,
                        'form_data'                    => $formData,
                        'remarks'                      => null,
                        'created_at'                   => $createdAt,
                        'updated_at'                   => $now,
                    ]);

                    // ── STEP 3: Student (simulates registrar acceptance) ───
                    DB::table('students')->insert([
                        // Registration
                        'registration_code'            => $regCode,
                        'registration_code_used'       => true,
                        'registration_code_expires_at' => $codeExpires,
                        // FKs
                        'user_id'                      => $userId,
                        'candidate_id'                 => $candidateId,
                        'section_id'                   => $section->id,
                        'student_id'                   => $studentId,
                        // Identity
                        'first_name'                   => $firstName,
                        'last_name'                    => $lastName,
                        'middle_name'                  => $middleName,
                        'birthdate'                    => $birthdate,
                        'gender'                       => $gender,
                        'address'                      => $address,
                        'photo'                        => null,
                        // Guardian
                        'guardian_name'                => $guardianName,
                        'guardian_contact'             => $contactNumber,
                        'guardian_relationship'        => $relationship,
                        // Academic
                        'course'                       => $program->name ?? null,
                        'major'                        => null,
                        'year_level'                   => $yearLevelInt,
                        'academic_status'              => $academicStatus,
                        'enrollment_status'            => 'enrolled',
                        'school_year'                  => $schoolYear,
                        // Profiling
                        'skills'                       => json_encode($selectedSkills),
                        'activities'                   => json_encode($selectedActivities),
                        'total_engagement_points'      => 0,
                        // Timestamps
                        'created_at'                   => $createdAt,
                        'updated_at'                   => $now,
                        'deleted_at'                   => null,
                    ]);

                    $created++;
                });
            } catch (\Throwable $e) {
                $skipped++;
                $this->command->newLine();
                $this->command->warn("  ✗ Skipped student #{$i}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine(2);
        $this->command->info("✓ Created : {$created} students");
        if ($skipped > 0) {
            $this->command->warn("✗ Skipped : {$skipped} (see warnings above)");
        }
    }
}
