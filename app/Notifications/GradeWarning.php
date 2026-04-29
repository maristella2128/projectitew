<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class GradeWarning extends Notification
{
    use Queueable;

    protected $grade;

    public function __construct($grade)
    {
        $this->grade = $grade;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Academic Warning',
            'message' => "Grade alert in {$this->grade->subject}: Score of {$this->grade->score} recorded.",
            'subject' => $this->grade->subject,
            'score' => $this->grade->score,
            'url' => '/grades',
        ];
    }
}
