<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserBlockUnblock
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->is_blocked) {
            $user->currentAccessToken()?->delete();

            return response()->json(['message' => 'Your account has been blocked.'], 403);
        }

        return $next($request);
    }
}
