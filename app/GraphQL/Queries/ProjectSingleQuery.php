<?php

namespace App\GraphQL\Queries;

use App\Models\Project;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;

class ProjectSingleQuery extends Query
{
    protected $attributes = [
        'name' => 'Project',
    ];

    public function type(): Type
    {
        return GraphQL::type('Project');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
                'description' => 'The id of the Project'
            ]
        ];
    }

    public function resolve($root, $args)
    {
        return Project::findOrFail($args['id']);
    }
}