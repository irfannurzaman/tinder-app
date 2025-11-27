<?php

namespace App\Console\Commands;

use App\Services\PersonService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CheckHighLikes extends Command
{
    protected $signature = 'people:check-high-likes {--threshold=50}';
    protected $description = 'Check for people with high likes and notify admin';

    public function __construct(
        private PersonService $personService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $threshold = (int) $this->option('threshold');
        $this->info("Checking for people with {$threshold}+ likes...");

        $people = $this->personService->getPeopleWithHighLikes($threshold);

        if ($people->isEmpty()) {
            $this->info('No people found with high likes.');
            return Command::SUCCESS;
        }

        $this->info("Found {$people->count()} people with {$threshold}+ likes.");

        $adminEmail = config('mail.admin_email', 'admin@example.com');

        foreach ($people as $person) {
            try {
                Mail::raw(
                    "Person {$person->name} (ID: {$person->id}) has {$person->like_count} likes.",
                    function ($message) use ($adminEmail, $person) {
                        $message->to($adminEmail)
                            ->subject("High Likes Alert: {$person->name}");
                    }
                );

                $this->info("Email sent for {$person->name} ({$person->like_count} likes)");
            } catch (\Exception $e) {
                Log::error("Failed to send email for person {$person->id}: " . $e->getMessage());
                $this->error("Failed to send email for {$person->name}");
            }
        }

        return Command::SUCCESS;
    }
}



