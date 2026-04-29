<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentActivityRequest;
use App\Models\Student;
use App\Models\StudentActivity;
use App\Services\PointsCalculatorService;
use Illuminate\Http\Request;

class StudentActivityController extends Controller
{
    /**
     * Store a newly created student activity and trigger point recalculation.
     */
    public function store(StoreStudentActivityRequest $request, PointsCalculatorService $pointsService)
    {
        $activity = StudentActivity::create($request->validated());

        // Refresh points and ranking for the student
        $pointsService->recalculateForStudent($activity->student);

        return redirect()->back()->with('success', 'Activity recorded and points updated.');
    }

    /**
     * Update the specified student activity record.
     */
    public function update(StoreStudentActivityRequest $request, StudentActivity $studentActivity, PointsCalculatorService $pointsService)
    {
        $studentActivity->update($request->validated());

        // Refresh points and ranking for the student
        $pointsService->recalculateForStudent($studentActivity->student);

        return redirect()->back()->with('success', 'Activity updated.');
    }

    /**
     * Remove the specified student activity record.
     */
    public function destroy(StudentActivity $studentActivity, PointsCalculatorService $pointsService)
    {
        $student = $studentActivity->student;
        $studentActivity->delete();

        // Refresh points after removal
        $pointsService->recalculateForStudent($student);

        return redirect()->back()->with('success', 'Activity removed from registry.');
    }
}
