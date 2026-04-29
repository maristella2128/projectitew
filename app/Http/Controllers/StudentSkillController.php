<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentSkill;
use Illuminate\Http\Request;

class StudentSkillController extends Controller
{
    /**
     * Store a new skill for the specified student.
     */
    public function store(Request $request, Student $student)
    {
        $validated = $request->validate([
            'skill'       => 'required|string|max:100',
            'proficiency' => 'required|string|in:Beginner,Intermediate,Advanced,Expert',
            'source'      => 'nullable|string|max:100',
        ]);

        $student->studentSkills()->create($validated);

        return redirect()->back()->with('success', 'Skill added to student profile.');
    }

    /**
     * Remove the specified skill.
     */
    public function destroy(StudentSkill $skill)
    {
        $skill->delete();

        return redirect()->back()->with('success', 'Skill removed from profile.');
    }
}
