<?php

namespace App\GraphQL\Queries;

use App\Models\Project;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;

class ProjectQuery extends Query
{
    protected $attributes = [
        'name' => 'projects',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('Project'));
    }

    public function args(): array
    {
        return [
            'limit' => [
                'type' => Type::int(),
                'description' => 'Limit the number of projects returned',
                'defaultValue' => 10, // Default limit
            ],
            'page' => [
                'type' => Type::int(),
                'description' => 'Page number for pagination',
                'defaultValue' => 1, // Default page
            ],
        ];
    }
    public function resolve($root, $args)
    {
        $limit = $args['limit'] ?? 10;
        $page = $args['page'] ?? 1;

        return Project::with(['tasks', 'createdBy']) // Fetch related models too
            ->paginate($limit, ['*'], 'page', $page);
    }
}
