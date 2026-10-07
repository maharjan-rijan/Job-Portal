<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogPostRequest;
use App\Http\Requests\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $posts = BlogPost::query()
            ->when($request->filled('q'), function ($query) use ($request) {
                $term = '%' . $request->input('q') . '%';
                $query->where(function ($q) use ($term) {
                    $q->where('title', 'like', $term)
                        ->orWhere('excerpt', 'like', $term)
                        ->orWhere('author', 'like', $term);
                });
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where('category', $request->input('category'));
            })
            ->latest('published_at')
            ->get();

        return response()->json($posts);
    }

    /** GET /blog/{blogPost} */
    public function show(BlogPost $blogPost)
    {
        return response()->json($blogPost);
    }

    /** GET /blog/categories — distinct category names for the filter pills on BlogList.jsx. */
    public function categories()
    {
        return response()->json(
            BlogPost::query()->distinct()->orderBy('category')->pluck('category')
        );
    }

    /** POST /blog — admin-only. */
    public function store(StoreBlogPostRequest $request)
    {
        $post = BlogPost::create([
            ...$request->validated(),
            'published_at' => now(),
        ]);

        return response()->json($post, 201);
    }

    /** PUT /blog/{blogPost} — admin-only. */
    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost)
    {
        $blogPost->update($request->validated());

        return response()->json($blogPost->fresh());
    }

    /** DELETE /blog/{blogPost} — admin-only. */
    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();

        return response()->json(['message' => 'Post deleted']);
    }
}
