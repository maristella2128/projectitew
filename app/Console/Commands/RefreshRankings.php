<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RefreshRankings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rankings:refresh';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculates all student rankings and engagement scores';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\PointsCalculatorService $service)
    {
        $this->info('Refreshing all student rankings...');
        
        $count = $service->refreshAllRankings();
        
        $this->info("Successfully refreshed rankings for {$count} student records.");
    }
}
