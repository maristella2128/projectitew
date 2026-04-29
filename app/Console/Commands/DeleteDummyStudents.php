<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;
use App\Models\User;

class DeleteDummyStudents extends Command
{
    protected $signature   = 'students:delete-dummy {--force : Force the operation to run without confirmation}';
    protected $description = 'Delete all dummy seeded students (StudentFirstNameN StudentLastNameN)';

    public function handle()
    {
        $firstNames = array_map(fn($i) => "StudentFirstName{$i}", range(1, 50));
        $lastNames  = array_map(fn($i) => "StudentLastName{$i}",  range(1, 50));

        $students = Student::whereIn('first_name', $firstNames)
                           ->whereIn('last_name',  $lastNames)
                           ->get();

        if ($students->isEmpty()) {
            $this->info('No dummy students found.');
            return;
        }

        $this->table(
            ['ID', 'First Name', 'Last Name'],
            $students->map(fn($s) => [$s->id, $s->first_name, $s->last_name])->toArray()
        );

        if (!$this->option('force') && !$this->confirm("Delete these {$students->count()} students?")) {
            $this->warn('Cancelled.');
            return;
        }

        $userIds    = $students->pluck('user_id')->filter()->toArray();
        $studentIds = $students->pluck('id')->toArray();

        User::whereIn('id', $userIds)->delete();
        $count = Student::whereIn('id', $studentIds)->delete();

        $this->info("✓ Deleted {$count} students and " . count($userIds) . " user accounts.");
    }
}
