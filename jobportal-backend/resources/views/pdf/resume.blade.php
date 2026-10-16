<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4; margin: 0.5in; }
    * { box-sizing: border-box; }
    body { font-family: Helvetica, Arial, sans-serif; color: #18181b; font-size: 12px; line-height: 1.5; margin: 0; }

    /* Structure shared by all three templates — only the rules below
       this block (keyed off body.template-*) change how it looks. */
    .entry { margin-bottom: 10px; }
    .entry .entry-title { font-size: 13px; font-weight: bold; }
    .entry .entry-meta { color: #555; font-size: 11px; }
    .entry .entry-desc { margin: 4px 0 0; font-size: 12px; }
    .entry .entry-desc p { margin: 0 0 4px; }
    .entry .entry-desc ul, .entry .entry-desc ol { margin: 0 0 4px 18px; padding: 0; }
    a { color: {{ $resume->color }}; text-decoration: none; }

    /* Classic (default) — centered header, colored rule + underlined section headers */
    body.template-classic .header { text-align: center; margin-bottom: 4px; }
    body.template-classic .header h1 { margin: 0; font-size: 26px; letter-spacing: 0.5px; color: #111827; font-weight: bold; }
    body.template-classic .header .role { margin: 2px 0 6px; font-size: 15px; font-weight: bold; color: {{ $resume->color }}; text-transform: uppercase; }
    body.template-classic .header .contact { font-size: 11px; color: #333; }
    body.template-classic .rule { border: none; border-top: 2px solid {{ $resume->color }}; margin: 12px 0 16px; }
    body.template-classic h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: {{ $resume->color }}; border-bottom: 1px solid {{ $resume->color }}; padding-bottom: 4px; margin: 18px 0 8px; }

    /* Modern — left-aligned header, colored pill-style section labels */
    body.template-modern .header { margin-bottom: 10px; border-bottom: 2px solid {{ $resume->color }}; padding-bottom: 10px; }
    body.template-modern .header h1 { margin: 0; font-size: 22px; color: #111827; }
    body.template-modern .header .role { margin: 2px 0 6px; font-size: 13px; color: {{ $resume->color }}; font-weight: bold; }
    body.template-modern .header .contact { font-size: 11px; color: #555; }
    body.template-modern h2 { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; background: {{ $resume->color }}; padding: 3px 10px; border-radius: 10px; margin: 16px 0 8px; }
    /* dompdf doesn't reliably support flexbox, so the avatar + name are
       laid out as inline-blocks with vertical-align instead — this is
       the one part of "modern" that needs its own markup below, since
       classic/minimal don't have an avatar at all. */
    body.template-modern .avatar {
      display: inline-block; vertical-align: middle; width: 52px; height: 52px; line-height: 52px;
      text-align: center; border-radius: 50%; background: {{ $resume->color }}; color: #ffffff;
      font-size: 17px; font-weight: bold; margin-right: 14px;
    }
    /* Real photo instead of the initials circle — dompdf needs an
       explicit object-fit-equivalent since it doesn't support that CSS
       property, so this crops via a fixed box + border-radius only;
       a non-square source photo may appear slightly stretched. */
    body.template-modern .avatar-photo {
      background: none; line-height: normal; padding: 0;
    }
    body.template-modern .header-text { display: inline-block; vertical-align: middle; }

    /* Minimal — plain, no rules or pills, just a colored left border per section */
    body.template-minimal .header { margin-bottom: 14px; }
    body.template-minimal .header h1 { margin: 0; font-size: 22px; font-weight: normal; color: #111827; }
    body.template-minimal .header .role { margin: 2px 0 6px; font-size: 12px; color: #555; }
    body.template-minimal .header .contact { font-size: 11px; color: #777; }
    body.template-minimal h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #111827; border-left: 3px solid {{ $resume->color }}; padding-left: 8px; margin: 16px 0 8px; }

    /* Social links — icon-only badges instead of printed platform
       names, matching the web preview (ResumeTemplate.jsx). dompdf
       can't reliably render icon fonts or arbitrary brand SVGs, so
       each badge is a small colored circle with a 1-2 letter mark
       instead — same idea as the initials avatar above, just smaller. */
    .social-links { margin: 6px 0 0; }
    .social-badge {
      display: inline-block; width: 20px; height: 20px; line-height: 20px;
      text-align: center; border-radius: 50%; border: 1px solid {{ $resume->color }};
      color: {{ $resume->color }}; font-size: 9px; font-weight: bold;
      text-decoration: none; margin-right: 6px;
    }
  </style>
</head>
<body class="template-{{ $resume->template ?? 'classic' }}">

  @php
    // $resume->name / ->email only exist via Resume::toArray()'s custom
    // injection (they aren't real columns on the resumes table) — that
    // override never fires for plain property access like $resume->name,
    // only when the model is actually array/json-converted. Reading
    // $resume->user->name directly here is what actually works; the
    // `user` relation is already eager-loaded by Resume's own
    // `booted(): retrieved` hook, so this is free.
    $resumeName = $resume->user?->name ?? '';
    $resumeEmail = $resume->user?->email ?? '';

    $initials = collect(explode(' ', $resumeName))
        ->filter()
        ->map(fn ($word) => mb_strtoupper(mb_substr($word, 0, 1)))
        ->take(2)
        ->implode('');
  @endphp

  <div class="header">
    @if(($resume->template ?? 'classic') === 'modern')
      @if($resume->user?->avatar_url)
        {{-- Real photo, same as the "modern" template shows on the web
             preview (ResumeTemplate.jsx) — falls back to the initials
             circle below only when the seeker hasn't set one. --}}
        <img
          src="{{ $resume->user->avatar_url }}"
          class="avatar avatar-photo"
          alt=""
        />
      @else
        <span class="avatar">{{ $initials }}</span>
      @endif
    @endif
    <div class="header-text">
    <h1>{{ $resumeName }}</h1>
    @if($resume->title)<p class="role">{{ $resume->title }}</p>@endif
    <p class="contact">
      {{ $resumeEmail }}
      @if($resume->location) &middot; {{ $resume->location }} @endif
      @if($resume->website) &middot; {{ $resume->website }} @endif
      {{-- expected_salary intentionally not shown on the resume document
           itself — it's a form field for the seeker's own reference /
           future matching use, not something meant to print. --}}
    </p>
    @if(!empty($resume->social_links))
      @php
        // Same short-mark idea as SOCIAL_ICONS in ResumeTemplate.jsx —
        // dompdf can't use that component's actual lucide icons, so
        // this is the closest PDF-safe equivalent: a 1-2 letter badge
        // instead of a brand logo, same platforms, same fallback.
        $socialMarks = [
            'LinkedIn' => 'in',
            'GitHub' => 'gh',
            'Twitter / X' => 'X',
            'Portfolio' => 'P',
            'Behance' => 'Be',
            'Dribbble' => 'Dr',
        ];
      @endphp
      <p class="social-links">
        @foreach($resume->social_links as $link)
          <a
            href="{{ $link['url'] }}"
            class="social-badge"
            title="{{ $link['platform'] }}"
          >{{ $socialMarks[$link['platform'] ?? ''] ?? '•' }}</a>
        @endforeach
      </p>
    @endif
    </div>
  </div>

  @if(($resume->template ?? 'classic') === 'classic')
    <hr class="rule" />
  @endif

  @if(!empty($resume->education))
    <h2>Education</h2>
    @foreach($resume->education as $entry)
      <div class="entry">
        <div class="entry-title">{{ $entry['degree'] }}, {{ $entry['fieldOfStudy'] ?? $entry['field_of_study'] ?? '' }}</div>
        <div class="entry-meta">{{ $entry['school'] }} &middot; {{ $entry['from'] }} &ndash; {{ $entry['to'] }}</div>
        @if(!empty($entry['description']))
          {{-- education description is the one rich-text field in this
               app (see ResumeForm's RichTextEditor) — strip to a safe
               tag allowlist and print raw instead of escaping it --}}
          <div class="entry-desc">{!! strip_tags($entry['description'], '<p><br><strong><em><b><i><ul><ol><li><a>') !!}</div>
        @endif
      </div>
    @endforeach
  @endif

  @if(!empty($resume->experience))
    <h2>Work Experience</h2>
    @foreach($resume->experience as $entry)
      <div class="entry">
        <div class="entry-title">{{ $entry['jobTitle'] ?? $entry['job_title'] ?? '' }} at {{ $entry['companyName'] ?? $entry['company_name'] ?? '' }}</div>
        <div class="entry-meta">{{ $entry['from'] }} &ndash; {{ $entry['to'] }}</div>
        @if(!empty($entry['description']))
          {{-- Same rich-text field as education — raw HTML from
               ResumeForm's RichTextEditor, not plain text, so this must
               use {!! !!} + strip_tags() the same way, not {{ }}, or
               the tags print literally instead of being rendered. --}}
          <div class="entry-desc">{!! strip_tags($entry['description'], '<p><br><strong><em><b><i><ul><ol><li><a>') !!}</div>
        @endif
      </div>
    @endforeach
  @endif

  @if(!empty($resume->achievements))
    <h2>Achievements &amp; Certificates</h2>
    @foreach($resume->achievements as $entry)
      <div class="entry">
        <div class="entry-title">{{ $entry['title'] }}</div>
        @if(!empty($entry['issuer']) || !empty($entry['date']))
          <div class="entry-meta">{{ implode(' · ', array_filter([$entry['issuer'] ?? null, $entry['date'] ?? null])) }}</div>
        @endif
        @if(!empty($entry['description']))
          <div class="entry-desc">{!! strip_tags($entry['description'], '<p><br><strong><em><b><i><ul><ol><li><a>') !!}</div>
        @endif
      </div>
    @endforeach
  @endif

</body>
</html>