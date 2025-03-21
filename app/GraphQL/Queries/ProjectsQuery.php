<?php

namespace App\GraphQL\Queries;

use App\Models\Project;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;

class ProjectsQuery extends Query
{
    protected $attributes = [
        'name' => 'projects'
    ];

    public function type(): Type
    {
        return Type::nonNull(
            Type::listOf(
                Type::nonNull(
                    GraphQL::type(
                        (isset($this->args['limit']) && $this->args['limit'] > 0) && isset($this->args['page'])
                            ? 'ProjectPagination'
                            : 'Project'
                    )
                )
            )
        );
    }

    public function args(): array
    {
        return [
            'limit' => ['type' => Type::int(), 'description' => 'Number of records per page'],
            'page' => ['type' => Type::int(), 'description' => 'Current page number'],
        ];
    }

    public function resolve($root, $args)
    {
        if ($args['limit'] && $args['page']) {
            $limit = $args['limit'] ?? 10;
            $page = $args['page'] ?? 1;

            $projects = Project::paginate($limit, ['*'], 'page', $page);

            return [
                'data' => $projects->items(),
                'total' => $projects->total(),
                'per_page' => $projects->perPage(),
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
            ];
        } else {
            return Project::all();
        }
    }
}
