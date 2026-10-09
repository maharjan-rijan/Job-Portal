<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /** GET /notifications — most recent first, capped at 50. */
    public function index(Request $request)
    {
        return response()->json(
            Notification::where('user_id', $request->user()->id)
                ->latest()
                ->limit(50)
                ->get()
        );
    }

    /** GET /notifications/unread-count */
    public function unreadCount(Request $request)
    {
        return response()->json([
            'count' => Notification::where('user_id', $request->user()->id)
                ->whereNull('read_at')
                ->count(),
        ]);
    }

    /** PATCH /notifications/{notification}/read */
    public function markRead(Request $request, Notification $notification)
    {
        abort_if($notification->user_id !== $request->user()->id, 403);

        if (! $notification->read_at) {
            $notification->update(['read_at' => now()]);
        }

        return response()->json($notification->fresh());
    }

    /** PATCH /notifications/read-all */
    public function markAllRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
