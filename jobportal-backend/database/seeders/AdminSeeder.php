<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\JobPost;
use App\Models\Resume;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

/**
 * Demo data: 3 seekers (each with a resume), 3 employers (each with a
 * company profile and 5 job posts — 15 jobs total). All passwords:
 * "password". Called from DatabaseSeeder::run().
 */
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $seekers = $this->seedSeekers();
        $employers = $this->seedEmployers();

        $this->command?->info(
            'Seeded ' . count($seekers) . ' seekers, ' . count($employers) . ' employers, '
                . 'each employer with 5 job posts.'
        );
    }

    private function seedSeekers(): array
    {
        $seekerData = [
            [
                'name' => 'Aarati Shrestha',
                'email' => 'aarati.seeker@example.com',
                'resume' => [
                    'title' => 'Frontend Developer',
                    'location' => 'Kathmandu, Nepal',
                    'website' => 'https://aaratishrestha.dev',
                    'expected_salary' => 'NPR 60,000 - 80,000',
                    'education' => [
                        [
                            'degree' => 'Bachelor of Computer Applications',
                            'field_of_study' => 'Computer Science',
                            'school' => 'Tribhuvan University',
                            'from' => '2019',
                            'to' => '2023',
                            'description' => 'Graduated with a focus on web technologies.',
                        ],
                    ],
                    'experience' => [
                        [
                            'company_name' => 'Webtech Nepal',
                            'job_title' => 'Junior Frontend Developer',
                            'from' => '2023-06',
                            'to' => 'Present',
                            'description' => 'Built and maintained React dashboards for clients.',
                        ],
                    ],
                    'social_links' => [
                        ['platform' => 'GitHub', 'url' => 'https://github.com/aaratishrestha'],
                        ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/in/aaratishrestha'],
                    ],
                    'achievements' => [
                        [
                            'title' => 'Best Final Year Project',
                            'issuer' => 'Tribhuvan University',
                            'date' => '2023-05',
                            'description' => 'Awarded for a job portal capstone project.',
                        ],
                    ],
                    'template' => 'classic',
                    'color' => '#2042e3',
                ],
            ],
            [
                'name' => 'Bikash Thapa',
                'email' => 'bikash.seeker@example.com',
                'resume' => [
                    'title' => 'Backend Developer',
                    'location' => 'Pokhara, Nepal',
                    'website' => '',
                    'expected_salary' => 'NPR 70,000 - 90,000',
                    'education' => [
                        [
                            'degree' => 'Bachelor of Engineering',
                            'field_of_study' => 'Computer Engineering',
                            'school' => 'Pokhara University',
                            'from' => '2018',
                            'to' => '2022',
                            'description' => '',
                        ],
                    ],
                    'experience' => [
                        [
                            'company_name' => 'Danphe Tech',
                            'job_title' => 'Laravel Developer',
                            'from' => '2022-07',
                            'to' => 'Present',
                            'description' => 'Developed REST APIs for internal tools using Laravel.',
                        ],
                    ],
                    'social_links' => [
                        ['platform' => 'GitHub', 'url' => 'https://github.com/bikashthapa'],
                    ],
                    'achievements' => [],
                    'template' => 'modern',
                    'color' => '#059669',
                ],
            ],
            [
                'name' => 'Sunita Gurung',
                'email' => 'sunita.seeker@example.com',
                'resume' => [
                    'title' => 'UI/UX Designer',
                    'location' => 'Lalitpur, Nepal',
                    'website' => 'https://sunitagurung.design',
                    'expected_salary' => 'NPR 55,000 - 75,000',
                    'education' => [
                        [
                            'degree' => 'Bachelor of Fine Arts',
                            'field_of_study' => 'Visual Design',
                            'school' => 'Kathmandu University',
                            'from' => '2017',
                            'to' => '2021',
                            'description' => '',
                        ],
                    ],
                    'experience' => [
                        [
                            'company_name' => 'Creative Labs Nepal',
                            'job_title' => 'Product Designer',
                            'from' => '2021-09',
                            'to' => 'Present',
                            'description' => 'Designed user flows and interfaces for mobile apps.',
                        ],
                    ],
                    'social_links' => [
                        ['platform' => 'Behance', 'url' => 'https://behance.net/sunitagurung'],
                        ['platform' => 'Portfolio', 'url' => 'https://sunitagurung.design'],
                    ],
                    'achievements' => [
                        [
                            'title' => 'Design Excellence Award',
                            'issuer' => 'Creative Labs Nepal',
                            'date' => '2023-01',
                            'description' => 'Recognized for redesigning the onboarding flow.',
                        ],
                    ],
                    'template' => 'minimal',
                    'color' => '#7c3aed',
                ],
            ],
        ];

        $seekers = [];

        foreach ($seekerData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'seeker',
            ]);

            Resume::create(array_merge(
                ['user_id' => $user->id],
                $data['resume'],
            ));

            $seekers[] = $user;
        }

        return $seekers;
    }

    private function seedEmployers(): array
    {
        $employerData = [
            [
                'name' => 'Rijan Maharjan',
                'email' => 'maharjan@example.com',
                'company' => [
                    'name' => 'Maharjan Pvt. Ltd.',
                    'website' => 'https://maharjanpvtltd.com',
                    'industry' => 'Software',
                    'location' => 'Kathmandu, Nepal',
                    'description' => 'A software company building products for local businesses.',
                    'logo_url' => null,
                ],
                'jobs' => [
                    ['title' => 'Frontend Developer (React)', 'type' => 'Full time', 'experience_level' => 'Mid level'],
                    ['title' => 'Backend Developer (Laravel)', 'type' => 'Full time', 'experience_level' => 'Mid level'],
                    ['title' => 'UI/UX Designer', 'type' => 'Part time', 'experience_level' => 'Entry level'],
                    ['title' => 'QA Engineer', 'type' => 'Contract', 'experience_level' => 'Entry level'],
                    ['title' => 'DevOps Intern', 'type' => 'Internship', 'experience_level' => 'Entry level'],
                ],
            ],
            [
                'name' => 'Priya Sharma',
                'email' => 'priya.employer@example.com',
                'company' => [
                    'name' => 'Himal Innovations',
                    'website' => 'https://himalinnovations.com',
                    'industry' => 'Fintech',
                    'location' => 'Lalitpur, Nepal',
                    'description' => 'Building digital payment solutions for Nepal.',
                    'logo_url' => null,
                ],
                'jobs' => [
                    ['title' => 'Mobile App Developer (Flutter)', 'type' => 'Full time', 'experience_level' => 'Mid level'],
                    ['title' => 'Product Manager', 'type' => 'Full time', 'experience_level' => 'Senior level'],
                    ['title' => 'Data Analyst', 'type' => 'Full time', 'experience_level' => 'Entry level'],
                    ['title' => 'Customer Support Executive', 'type' => 'Part time', 'experience_level' => 'Entry level'],
                    ['title' => 'Security Engineer', 'type' => 'Contract', 'experience_level' => 'Senior level'],
                ],
            ],
            [
                'name' => 'Suresh Karki',
                'email' => 'suresh.employer@example.com',
                'company' => [
                    'name' => 'Everest Digital Solutions',
                    'website' => 'https://everestdigital.com',
                    'industry' => 'IT Services',
                    'location' => 'Pokhara, Nepal',
                    'description' => 'IT consulting and outsourcing for international clients.',
                    'logo_url' => null,
                ],
                'jobs' => [
                    ['title' => 'Full Stack Developer', 'type' => 'Full time', 'experience_level' => 'Mid level'],
                    ['title' => 'WordPress Developer', 'type' => 'Remote', 'experience_level' => 'Entry level'],
                    ['title' => 'Technical Writer', 'type' => 'Part time', 'experience_level' => 'Entry level'],
                    ['title' => 'Network Administrator', 'type' => 'Full time', 'experience_level' => 'Mid level'],
                    ['title' => 'Marketing Intern', 'type' => 'Internship', 'experience_level' => 'Entry level'],
                ],
            ],
        ];

        $employers = [];

        foreach ($employerData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'employer',
            ]);

            Company::create(array_merge(
                ['user_id' => $user->id],
                $data['company'],
            ));

            foreach ($data['jobs'] as $index => $job) {
                JobPost::create([
                    'employer_id' => $user->id,
                    'title' => $job['title'],
                    'type' => $job['type'],
                    'location' => $data['company']['location'],
                    'salary_min' => 40000 + ($index * 5000),
                    'salary_max' => 70000 + ($index * 8000),
                    'vacancies' => rand(1, 3),
                    'experience_level' => $job['experience_level'],
                    'application_deadline' => Carbon::now()->addDays(30 + $index * 5)->format('Y-m-d'),
                    'description' => "We are looking for a {$job['title']} to join {$data['company']['name']}. "
                        . 'You will work closely with the product and engineering team to deliver quality work.',
                    'responsibilities' => [
                        'Collaborate with cross-functional teams',
                        'Deliver well-tested, maintainable work on schedule',
                        'Participate in planning and code/design reviews',
                    ],
                    'requirements' => [
                        'Relevant experience for the role',
                        'Strong communication skills',
                        'Ability to work independently',
                    ],
                    'benefits' => [
                        'Competitive salary',
                        'Flexible working hours',
                        'Learning and development budget',
                    ],
                    'status' => 'Open',
                ]);
            }

            $employers[] = $user;
        }

        return $employers;
    }
}
