<?php

namespace App\Http\Requests;

use App\Enums\ProjectStatus;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
        // dd($this->project);
        return [
            'name' => 'required|string|unique:projects,name,' .  $this->project->id . ',id|max:255',
            'image' => 'nullable|image',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'status' => ['required', Rule::in(ProjectStatus::getValues())],
        ];
    }
}
