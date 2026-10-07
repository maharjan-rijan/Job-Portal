<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => "The internet is a job seeker's most crucial success tool",
                'category' => 'Career Advice',
                'author' => 'Maya Chen',
                'published_at' => Carbon::now()->subDays(10),
                'excerpt' => 'Online applications outnumber in-person ones ten to one. Here\'s how to make your digital footprint work in your favor instead of against you.',
                'content' => <<<'TEXT'
Job hunting has moved almost entirely online, and that changes the rules of the game. Recruiters search for candidates before candidates ever apply, which means your public profile is doing work whether you're actively looking or not.

Start by auditing what a hiring manager sees in the first ten seconds: your headline, your most recent role, and a handful of keywords tied to the job you want. Vague titles like "professional" or "hard worker" waste that space; specific, searchable skills don't.

Consistency matters more than polish. A resume, a LinkedIn profile, and a portfolio that all tell the same story build more trust than any single, perfectly worded page.
TEXT,
            ],
            [
                'title' => 'Today, from connecting with potential employers',
                'category' => 'Networking',
                'author' => 'Daniel Osei',
                'published_at' => Carbon::now()->subDays(18),
                'excerpt' => 'Cold outreach has a bad reputation, but a short, specific message still outperforms a hundred anonymous applications.',
                'content' => <<<'TEXT'
Most candidates apply and wait. The ones who get interviews follow up — briefly, specifically, and without apologizing for reaching out.

A good message names the role, references something real about the team or the product, and asks for one small thing: a fifteen-minute call, a referral, or simply confirmation the application was received. That's it. No essay, no attached resume in the first message.

If you only have time to improve one part of your job search, make it this: turn ten silent applications into three warm conversations.
TEXT,
            ],
            [
                'title' => "We've weeded through hundreds of job-hunting tips",
                'category' => 'Career Advice',
                'author' => 'Priya Nair',
                'published_at' => Carbon::now()->subDays(26),
                'excerpt' => 'Most job-search advice is recycled or outdated. These are the handful of tactics that actually move the needle in 2026.',
                'content' => <<<'TEXT'
There's no shortage of job-search advice, and most of it is generic enough to apply to any job, in any decade. We looked at what actually correlated with faster offers among people we've worked with, and it came down to three things.

First, applying within 48 hours of a posting going live roughly doubles response rates — most roles get the bulk of their applicants in the first week. Second, tailoring the top third of a resume to the specific listing matters far more than a full rewrite. Third, candidates who could speak to one concrete result (a number, a shipped feature, a resolved incident) consistently outperformed candidates with longer but vaguer experience sections.

None of this is exotic. It's just specific, and specific is rare.
TEXT,
            ],
            [
                'title' => 'What hiring managers actually read first on a resume',
                'category' => 'Resume Tips',
                'author' => 'Aarati Shrestha',
                'published_at' => Carbon::now()->subDays(6),
                'excerpt' => 'Eye-tracking studies and recruiter interviews agree: the first six lines decide whether the rest gets read at all.',
                'content' => <<<'TEXT'
A resume gets scanned, not read — at least on the first pass. The top third of the first page carries almost all the weight: your most recent title, the company, and one or two lines that make the reader want to keep going.

Skip the generic summary paragraph. Replace it with a single line that states your role, your specialty, and a number that proves it — years of experience, a scale you've worked at, or a result you've delivered.

Everything below that line exists to back up the claim you just made at the top, not to introduce new ones.
TEXT,
            ],
            [
                'title' => 'Remote interviews: what changes and what stays the same',
                'category' => 'Interview Prep',
                'author' => 'Bikash Thapa',
                'published_at' => Carbon::now()->subDays(2),
                'excerpt' => 'A video call rewards different habits than an in-person interview — here\'s what to adjust without overthinking it.',
                'content' => <<<'TEXT'
The substance of a good interview answer doesn't change over video — structure your examples, be specific, ask real questions. What changes is everything around it.

Test your camera and audio before the call, not during it. Sit somewhere with a plain background and light facing you, not behind you. Keep a glass of water and your notes just out of frame, since a long pause while you dig for something looks worse on video than it would in person.

The one real advantage: you can keep a short list of talking points next to the screen. Use it to stay on track, not to read from.
TEXT,
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::firstOrCreate(
                ['title' => $post['title']],
                $post,
            );
        }

        $this->command?->info('Seeded ' . count($posts) . ' blog posts.');
    }
}
