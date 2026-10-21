<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Runs on every authenticated API request. If the admin has blocked the user
 * since they logged in, the request is rejected with 403 ACCOUNT_BLOCKED and
 * all of the user's tokens are revoked. The React app (lib/axios.js) reacts to
 * that code by sending the user to the login page.
 *
 * The block flag is the `is_blocked` column — the same one AdminController and
 * AuthController use. The user is re-read from the DB by Sanctum on each
 * request, so a block takes effect on the very next call.
 */
class CheckUserBlockUnblock
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->is_blocked) {
            // Kill every session (all devices), not just the current token.
            $user->tokens()->delete();

            return response()->json([
                'message' => 'Your account has been blocked by the administrator.',
                'code' => 'ACCOUNT_BLOCKED',
            ], 403);
        }

        return $next($request);
    }
}
