<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Helvetica, Arial, sans-serif; color: #18181b; font-size: 13px; line-height: 1.5; }
    h1 { margin: 0 0 4px; font-size: 22px; }
    h2 { font-size: 15px; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; margin-top: 22px; }
    .meta { color: #555; font-size: 12px; }
    .entry { margin-bottom: 12px; }
    .entry strong { font-size: 13px; }
    .entry span { color: #555; }
    .entry p { margin: 4px 0 0; }
    a { color: #10b981; text-decoration: none; }
  </style>
</head>
<body>
  <h1>{{ $resume->name }}</h1>
  <p class="meta">{{ $resume->title }}</p>
  <p class="meta">
    {{ $resume->email }}
    @if($resume->location) &middot; {{ $resume->location }} @endif
    @if($resume->website) &middot; {{ $resume->website }} @endif
  </p>

  @if(!empty($resume->social_links))
    <p class="meta">
      @foreach($resume->social_links as $link)
        <a href="{{ $link['url'] }}">{{ $link['platform'] }}</a>&nbsp;&nbsp;
      @endforeach
    </p>
  @endif

  @if(!empty($resume->education))
    <h2>Education</h2>
    @foreach($resume->education as $entry)
      <div class="entry">
        <strong>{{ $entry['degree'] }}, {{ $entry['fieldOfStudy'] ?? $entry['field_of_study'] ?? '' }}</strong><br/>
        <span>{{ $entry['school'] }} &middot; {{ $entry['from'] }} &ndash; {{ $entry['to'] }}</span>
        @if(!empty($entry['description']))<p>{{ $entry['description'] }}</p>@endif
      </div>
    @endforeach
  @endif

  @if(!empty($resume->experience))
    <h2>Work Experience</h2>
    @foreach($resume->experience as $entry)
      <div class="entry">
        <strong>{{ $entry['jobTitle'] ?? $entry['job_title'] ?? '' }} at {{ $entry['companyName'] ?? $entry['company_name'] ?? '' }}</strong><br/>
        <span>{{ $entry['from'] }} &ndash; {{ $entry['to'] }}</span>
        @if(!empty($entry['description']))<p>{{ $entry['description'] }}</p>@endif
      </div>
    @endforeach
  @endif

  @if(!empty($resume->achievements))
    <h2>Achievements &amp; Certificates</h2>
    @foreach($resume->achievements as $entry)
      <div class="entry">
        <strong>{{ $entry['title'] }}</strong>
        @if(!empty($entry['issuer']) || !empty($entry['date']))
          <span> &mdash; {{ implode(' · ', array_filter([$entry['issuer'] ?? null, $entry['date'] ?? null])) }}</span>
        @endif
        @if(!empty($entry['description']))<p>{{ $entry['description'] }}</p>@endif
      </div>
    @endforeach
  @endif
</body>
</html>
