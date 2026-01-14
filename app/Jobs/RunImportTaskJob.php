<?php

namespace App\Jobs;

use App\Models\ImportTask;
use App\Models\ImportTaskRun;
use App\Services\Import\ImportService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RunImportTaskJob implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 1;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 3600; // 1 hour

    /**
     * Create a new job instance.
     */
    public function __construct(
        public ImportTask $task,
        public ImportTaskRun $run
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ImportService $importService): void
    {
        try {
            $importService->execute($this->task, $this->run);
        } catch (\Exception $e) {
            Log::error('Import job failed', [
                'task_id' => $this->task->id,
                'run_id' => $this->run->id,
                'error' => $e->getMessage(),
            ]);

            $this->run->markAsFailed($e->getMessage());

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Import job failed permanently', [
            'task_id' => $this->task->id,
            'run_id' => $this->run->id,
            'error' => $exception->getMessage(),
        ]);

        $this->run->markAsFailed($exception->getMessage());
    }
}
