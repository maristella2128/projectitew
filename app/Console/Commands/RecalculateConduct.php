<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RecalculateConduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'conduct:recalculate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate all student conduct scores and clearances';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\ConductScoringService $service)
    {
        $this->info('Starting conduct score recalculation...');
        $service->recalculateAllScores();
        $this->info('Starting clearance evaluations...');
        $service->evaluateClearanceForAll();
        
        $count = \App\Models\Student::count();
        $this->info("Recalculated {$count} student scores and clearances");
    }
}
