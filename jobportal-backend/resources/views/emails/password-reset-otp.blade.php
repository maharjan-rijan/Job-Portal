<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Helvetica,Arial,sans-serif;color:#18181b;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
    <h2 style="margin:0 0 8px;font-size:20px;">Verification code</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#52525b;">
      Hi {{ $user->name }}, use this code to reset your {{ config('app.name') }} password:
    </p>
    <p style="margin:0 0 20px;text-align:center;font-size:34px;font-weight:bold;letter-spacing:10px;color:#059669;">
      {{ $otp }}
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:#52525b;">
      This code expires in {{ $minutes }} minutes. Never share it with anyone.
    </p>
    <p style="margin:0;font-size:13px;color:#a1a1aa;">
      Didn't ask for this? You can safely ignore this email — your password won't change.
    </p>
  </div>
</body>
</html>
