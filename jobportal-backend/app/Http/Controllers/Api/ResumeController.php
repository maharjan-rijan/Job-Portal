<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResumeUpdateRequest;
use App\Models\Resume;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ResumeController extends Controller
{
    public function downloadPdf(Resume $resume)
    {
        $pdf = Pdf::loadView('pdf.resume', ['resume' => $resume]);
        $filename = str_replace(' ', '-', strtolower($resume->name ?? 'resume')) . '.pdf';

        return $pdf->download($filename);
    }

    public function downloadMyPdf(Request $request)
    {
        $resume = $request->user()->resume;
        if (!$resume) {
            return response()->json(['message' => 'No resume yet'], 404);
        }
        $pdf = Pdf::loadView('pdf.resume', ['resume' => $resume]);
        return $pdf->download('my-resume.pdf');
    }

    public function show(Request $request)
    {
        $resume = $request->user()->resume;

        if (!$resume) {
            return response()->json(['message' => 'No resume yet'], 404);
        }

        return response()->json($resume);
    }

    public function update(ResumeUpdateRequest $request)
    {
        $resume = $request->user()->resume()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'title' => $request->title,
                'location' => $request->location,
                'website' => $request->website,
                'expected_salary' => $request->expectedSalary,
                'education' => $request->education,
                'experience' => $request->experience ?? [],
                'social_links' => $request->socialLinks ?? [],
                'achievements' => $request->achievements ?? [],
            ]
        );

        return response()->json($resume->fresh());
    }

    public function index(Request $request)
    {
        $query = Resume::query()->with('user')->latest();

        if ($request->filled('q')) {
            $keyword = $request->q;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('location', 'like', "%{$keyword}%");
            });
        }

        return response()->json($query->get());
    }

    public function showById(Resume $resume)
    {
        return response()->json($resume);
    }
}
