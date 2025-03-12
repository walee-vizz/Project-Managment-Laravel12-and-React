<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => ['required'],
            'name' => 'required|string|unique:projects,name|max:255',
            'image' => 'nullable|image',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'status' => ['required', Rule::in(TaskStatus::getValues())],
            'priority' => ['required', Rule::in(TaskPriority::getValues())],
            'assigned_user_id' => ['required'],
        ];
    }
}
