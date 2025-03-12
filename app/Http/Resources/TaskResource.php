<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data =  [
            'id' => optional($this)->id,
            'name' => optional($this)->name,
            'description' => optional($this)->description,
            'status' => optional($this)->status,
            'image_path' => optional($this)->image_path ? (strpos($this->image_path, 'via.placeholder.com') ? $this->image_path : Storage::url($this->image_path)) : null,
            'priority' => optional($this)->priority,
            'project' => optional($this)->project ? new ProjectResource($this->project) : null,
            'assigned_user' => optional($this)->assignedTo ? new UserResource($this->assignedTo) : null,
            'created_by' => optional($this)->createdBy ? new UserResource($this->createdBy) : null,
            'updated_by' => optional($this)->updatedBy ? new UserResource($this->updatedBy) : null,
        ];

        if (optional($this)->due_date && !is_string($this->due_date)) {
            $data['due_date'] = $this->due_date->format('Y-m-d');
        }
        if (optional($this)->created_at && !is_string($this->created_at)) {
            $data['created_at'] = $this->created_at->format('Y-m-d');
        }
        if (optional($this)->updated_at && !is_string($this->updated_at)) {
            $data['updated_at'] = $this->updated_at->format('Y-m-d');
        }
        return $data;
    }
}
