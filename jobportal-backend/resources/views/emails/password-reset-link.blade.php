<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Helvetica,Arial,sans-serif;color:#18181b;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
    <h2 style="margin:0 0 8px;font-size:20px;">Reset your password</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#52525b;">
      Hi {{ $user->name }}, we received a request to reset your {{ config('app.name') }} password.
    </p>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="{{ $url }}"
         style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:8px;">
        Reset password
      </a>
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:#52525b;">
      This link expires in {{ $minutes }} minutes and can be used once.
    </p>
    <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;word-break:break-all;">
      If the button doesn't work, paste this into your browser:<br>{{ $url }}
    </p>
    <p style="margin:0;font-size:13px;color:#a1a1aa;">
      Didn't ask for this? You can safely ignore this email — your password won't change.
    </p>
  </div>
</body>
</html>
