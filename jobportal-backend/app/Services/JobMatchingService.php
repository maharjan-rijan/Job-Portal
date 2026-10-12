<?php

namespace App\Services;


class JobMatchingService
{

    public const NOTIFY_THRESHOLD = 0.12;

    private const STOPWORDS = [
        'a',
        'an',
        'and',
        'are',
        'as',
        'at',
        'be',
        'by',
        'for',
        'from',
        'has',
        'he',
        'in',
        'is',
        'it',
        'its',
        'of',
        'on',
        'that',
        'the',
        'to',
        'was',
        'were',
        'will',
        'with',
        'this',
        'these',
        'those',
        'i',
        'you',
        'your',
        'we',
        'our',
        'they',
        'their',
        'or',
        'but',
        'if',
        'then',
        'so',
        'than',
        'not',
        'no',
        'do',
        'does',
        'did',
        'have',
        'had',
        'can',
        'could',
        'should',
        'would',
        'may',
        'might',
        'must',
        'shall',
        'about',
        'into',
        'over',
        'under',
        'again',
        'further',
        'once',
        'here',
        'there',
        'all',
        'any',
        'both',
        'each',
        'few',
        'more',
        'most',
        'other',
        'some',
        'such',
        'only',
        'own',
        'same',
        'too',
        'very',
        's',
        't',
        'just',
        'don',
        'now',
    ];

    /** Builds the resume "document" text from the fields that signal skill/fit. */
    public function resumeText(array $resume): string
    {
        $parts = [
            $resume['title'] ?? '',
            implode(' ', $resume['skills'] ?? []),
        ];

        foreach ($resume['experience'] ?? [] as $entry) {
            $parts[] = $entry['job_title'] ?? $entry['jobTitle'] ?? '';
            $parts[] = strip_tags($entry['description'] ?? '');
        }

        foreach ($resume['education'] ?? [] as $entry) {
            $parts[] = $entry['field_of_study'] ?? $entry['fieldOfStudy'] ?? '';
        }

        foreach ($resume['achievements'] ?? [] as $entry) {
            $parts[] = $entry['title'] ?? '';
        }

        return implode(' ', array_filter($parts));
    }

    /** Builds the job "document" text from the fields that describe what the role needs. */
    public function jobText(array $job): string
    {
        $requirements = $job['requirements'] ?? [];
        if (! is_array($requirements)) {
            $requirements = [];
        }

        $parts = [
            $job['title'] ?? '',
            $job['type'] ?? '',
            $job['description'] ?? '',
            implode(' ', $requirements),
        ];

        return implode(' ', array_filter($parts));
    }

    /** 0.0 (no overlap) to 1.0 (identical vocabulary) cosine similarity between two texts. */
    public function score(string $textA, string $textB): float
    {
        $tokensA = $this->tokenize($textA);
        $tokensB = $this->tokenize($textB);

        if (empty($tokensA) || empty($tokensB)) {
            return 0.0;
        }

        $vocabulary = array_unique(array_merge(array_keys($tokensA), array_keys($tokensB)));

        $idf = [];
        foreach ($vocabulary as $term) {
            $df = (isset($tokensA[$term]) ? 1 : 0) + (isset($tokensB[$term]) ? 1 : 0);
            // +1 inside the log (1 + 2/df) avoids idf collapsing to 0 for
            // terms shared by both documents, which would otherwise wipe
            // out exact skill matches entirely.
            $idf[$term] = log(1 + (2 / $df));
        }

        $vectorA = $this->tfidfVector($tokensA, $vocabulary, $idf);
        $vectorB = $this->tfidfVector($tokensB, $vocabulary, $idf);

        return $this->cosineSimilarity($vectorA, $vectorB);
    }

    /** Lowercase, strip punctuation/tags, drop stopwords + 1-letter tokens, count term frequency. */
    private function tokenize(string $text): array
    {
        $text = strtolower(strip_tags($text));
        $text = preg_replace('/[^a-z0-9\s]/', ' ', $text);
        $words = preg_split('/\s+/', trim($text), -1, PREG_SPLIT_NO_EMPTY);

        $counts = [];
        foreach ($words as $word) {
            if (strlen($word) < 2 || in_array($word, self::STOPWORDS, true)) {
                continue;
            }
            $counts[$word] = ($counts[$word] ?? 0) + 1;
        }

        return $counts;
    }

    private function tfidfVector(array $tokenCounts, array $vocabulary, array $idf): array
    {
        $totalTerms = array_sum($tokenCounts) ?: 1;
        $vector = [];

        foreach ($vocabulary as $term) {
            $tf = ($tokenCounts[$term] ?? 0) / $totalTerms;
            $vector[$term] = $tf * $idf[$term];
        }

        return $vector;
    }

    private function cosineSimilarity(array $vectorA, array $vectorB): float
    {
        $dotProduct = 0.0;
        $magnitudeA = 0.0;
        $magnitudeB = 0.0;

        foreach ($vectorA as $term => $weightA) {
            $weightB = $vectorB[$term] ?? 0.0;
            $dotProduct += $weightA * $weightB;
            $magnitudeA += $weightA ** 2;
        }

        foreach ($vectorB as $weightB) {
            $magnitudeB += $weightB ** 2;
        }

        $denominator = sqrt($magnitudeA) * sqrt($magnitudeB);

        return $denominator > 0 ? $dotProduct / $denominator : 0.0;
    }
}
