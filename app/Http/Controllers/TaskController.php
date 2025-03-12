<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Project;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();
        $sort_by = request('sortBy', 'created_at');
        $sort_dir = request('sortDir', 'DESC');

        $query->where(function ($q) {
            if (request('search')) {
                $q->where('name', 'like', '%' . request('search') . '%')
                    ->orWhereHas('project', function ($q) {
                        $q->where('name', 'like', '%' . request('search') . '%');
                    });
            }
        });

        if (request('status')) {
            $query->where('status', request('status'));
        }


        if (request('from_date')) {
            $query->whereDate('created_at', '>=', request('from_date'));
        }
        if (request('to_date')) {
            $query->whereDate('created_at', '<=', request('to_date'));
        }


        $tasks = $query->orderBy($sort_by, $sort_dir)
            ->paginate(15)->onEachSide(1);
        $data = [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null
        ];
        return inertia("tasks/index", $data);
    }


    /**
     * Display a listing of the resource.
     */
    public function my_tasks()
    {
        $query = Task::query();
        $sort_by = request('sortBy', 'created_at');
        $sort_dir = request('sortDir', 'DESC');
        $query->where('assigned_user_id', Auth::id());
        $query->where(function ($q) {
            if (request('search')) {
                $q->where('name', 'like', '%' . request('search') . '%')
                    ->orWhereHas('project', function ($q) {
                        $q->where('name', 'like', '%' . request('search') . '%');
                    });
            }
        });

        if (request('status')) {
            $query->where('status', request('status'));
        }


        if (request('from_date')) {
            $query->whereDate('created_at', '>=', request('from_date'));
        }
        if (request('to_date')) {
            $query->whereDate('created_at', '<=', request('to_date'));
        }


        $tasks = $query->orderBy($sort_by, $sort_dir)
            ->paginate(15)->onEachSide(1);
        $data = [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null
        ];
        return inertia("tasks/index", $data);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $users = User::select('name', 'id')->get();
        // $projects = Project::select('name', 'id')->get();
        // $data = [
        // 'users' => UserResource::collection($users),
        // 'projects' => ProjectResource::collection($projects),
        // ];
        // dd('asas');
        return inertia("tasks/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        // dd($request->all());
        $image = $request->file('image') ?? null;
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();
        if ($image) {
            $file_name = Str::random() . '-' . $image->getClientOriginalName();
            $uploaded = $image->store('tasks', 'public');
            $validated['image_path'] = $uploaded;
        }
        $task = Task::create($validated);

        return redirect()->route('tasks.index', $task->id)->with('success', 'Task created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        // dd($task);
        return inertia('tasks/show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {

        $data = [
            'task' => new TaskResource($task),
            'users' => UserResource::collection(User::select('name', 'id')->get()),
            'projects' => ProjectResource::collection(Project::select('name', 'id')->get()),
        ];

        // dd($data);
        return inertia('tasks/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $image = $request->file('image') ?? null;
        $validated = $request->validated();

        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->delete($task->image_path);
            }
            $file_name = Str::random() . '-' . $image->getClientOriginalName();
            $uploaded = $image->store('tasks', 'public');
            $validated['image_path'] = $uploaded;
        }
        $task->update($validated);
        return redirect()->route('tasks.show', $task->id)->with('success', 'Task updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $image = $task->image_path;
        if ($task->delete()) {
            if ($image) {
                Storage::disk('public')->delete($image);
            }
            return redirect()->route('tasks.index')->with('success', 'Task deleted successfully');
        } else {
            return redirect()->route('tasks.index')->with('error', 'Task failed to be deleted');
        }
    }
}
