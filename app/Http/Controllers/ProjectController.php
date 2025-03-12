<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query();
        $sort_by = request('sortBy', 'created_at');
        $sort_dir = request('sortDir', 'DESC');


        if (request('search')) {
            $query->where('name', 'like', '%' . request('search') . '%');
        }
        if (request('status')) {
            $query->where('status', request('status'));
        }


        if (request('from_date')) {
            $query->whereDate('created_at', '>=', request('from_date'));
        }
        if (request('to_date')) {
            $query->whereDate('created_at', '<=', request('to_date'));
        }
        session()->forget('success');

        // request()->session()->flush();
        // Session::put('error', 'Error');
        $projects = $query->orderBy($sort_by, $sort_dir)
            ->paginate(15);
        $data = [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,

        ];
        // dd($data['projects']);
        return inertia("projects/index", $data);
    }

    public function get_projects_list(Request $request)
    {
        $projects = ProjectResource::collection(Project::all());

        return response()->json(
            $projects,
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $data = [];
        return inertia('projects/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $image = $request->file('image') ?? null;
        $validated = $request->validated();
        // dd($request->all());
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();
        if ($image) {
            $file_name = Str::random() . '-' . $image->getClientOriginalName();
            $uploaded = $image->store('projects', 'public');
            $validated['image_path'] = $uploaded;
        }
        $project = Project::create($validated);

        return redirect()->route('projects.index')->with('success', 'Project created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $query = $project->tasks();
        $sort_by = request('sortBy', 'created_at');
        $sort_dir = request('sortDir', 'DESC');


        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        if (request('status')) {
            $query->where('status', request('status'));
        }


        if (request('start_date')) {
            $query->whereDate('created_at', '>=', request('start_date'));
        }
        if (request('end_date')) {
            $query->whereDate('created_at', '<=', request('end_date'));
        }


        $tasks = $query->orderBy($sort_by, $sort_dir)
            ->paginate(15)->onEachSide(1);
        $data = [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'project' => new ProjectResource($project),

        ];
        return  inertia('projects/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $data = [
            'project' => new ProjectResource($project),
        ];
        // dd($data);
        return  inertia('projects/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $image = $request->file('image') ?? null;
        $validated = $request->validated();

        if ($image) {
            if ($project->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }
            $file_name = Str::random() . '-' . $image->getClientOriginalName();
            $uploaded = $image->store('projects', 'public');
            $validated['image_path'] = $uploaded;
        }
        $project->update($validated);
        return redirect()->route('projects.show', $project->id)->with('success', 'Project updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $image = $project->image_path;
        if ($project->delete()) {
            if ($image) {
                Storage::disk('public')->delete($image);
            }
            return redirect()->route('projects.index')->with('success', 'Project deleted successfully');
        } else {
            return redirect()->route('projects.index')->with('error', 'Project failed to be deleted');
        }
    }
}
