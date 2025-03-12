<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => optional($this)->email,
            'profile_picture' => optional($this)->profile_picture_path,
        ];
        if ($this->email_verified_at && !is_string($this->email_verified_at)) {
            $data['email_verified_at'] = $this->email_verified_at->format('Y-m-d');
        }
        if ($this->created_at && !is_string($this->created_at)) {
            $data['created_at'] = $this->created_at->format('Y-m-d H:i:s A');
        }
        if ($this->updated_at && !is_string($this->updated_at)) {
            $data['updated_at'] = $this->updated_at->format('Y-m-d H:i:s A');
        }
        return $data;
        // return parent::toArray($request);
    }
}
