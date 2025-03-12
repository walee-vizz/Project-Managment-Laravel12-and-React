<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;
use App\Models\Project;

class ProjectType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Project',
        'description' => 'A Project entity',
        'model' => Project::class,
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
                'description' => 'Unique identifier for the project',
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'Name of the project',
            ],
            'image_path' => [
                'type' => Type::string(),
                'description' => 'Path to the project image',
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'Detailed description of the project',
            ],
            'due_date' => [
                'type' => Type::string(),
                'description' => 'Deadline for the project',
            ],
            'status' => [
                'type' => Type::string(),
                'description' => 'Current status of the project',
            ],
            'created_by' => [
                'type' => GraphQL::type('User'), // Single user, not a list
                'description' => 'User who created the project',
            ],
            'updated_by' => [
                'type' => GraphQL::type('User'), // Single user, not a list
                'description' => 'User who last updated the project',
            ],
            'created_at' => [
                'type' => Type::string(),
                'description' => 'Timestamp when the project was created',
            ],
            'updated_at' => [
                'type' => Type::string(),
                'description' => 'Timestamp when the project was last updated',
            ],
        ];
    }
}
