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
        $filename = str_replace(' ', '-', strtolower($resume->user?->name ?? 'resume')) . '.pdf';

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
        $existing = $request->user()->resume;

        $resume = $request->user()->resume()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'title' => $request->title,
                // Was missing before — the resume form has always sent
                // `skills`, but nothing here persisted it, so every
                // seeker's skills list silently vanished on save. This
                // is also the field the ML matcher depends on most.
                'skills' => $request->skills ?? $existing?->skills ?? [],
                'location' => $request->location,
                'website' => $request->website,
                'expected_salary' => $request->expectedSalary,
                'education' => $request->education,
                'experience' => $request->experience ?? [],
                'social_links' => $request->socialLinks ?? [],
                'achievements' => $request->achievements ?? [],
                'template' => $request->template ?? $existing?->template ?? 'classic',
                'color' => $request->color ?? $existing?->color ?? '#0f172a',
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
                    ->orWhere('location', 'like', "%{$keyword}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$keyword}%"))
                    ->orWhereRaw('JSON_SEARCH(education, "one", ?) IS NOT NULL', ["%{$keyword}%"])
                    ->orWhereRaw('JSON_SEARCH(experience, "one", ?) IS NOT NULL', ["%{$keyword}%"]);
            });
        }

        return response()->json($query->get());
    }

    public function showById(Resume $resume)
    {
        return response()->json($resume);
    }
}
