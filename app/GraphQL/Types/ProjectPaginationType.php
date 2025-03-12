<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;
use Rebing\GraphQL\Support\Facades\GraphQL;


class ProjectPaginationType extends GraphQLType
{
    protected $attributes = [
        'name' => 'ProjectPagination',
        'description' => 'A paginated list of projects',
    ];

    public function fields(): array
    {
        return [
            'data' => [
                'type' => Type::listOf(GraphQL::type('Project')),
                'description' => 'The list of projects',
            ],
            'total' => [
                'type' => Type::int(),
                'description' => 'Total number of projects',
            ],
            'per_page' => [
                'type' => Type::int(),
                'description' => 'Number of projects per page',
            ],
            'current_page' => [
                'type' => Type::int(),
                'description' => 'Current page number',
            ],
            'last_page' => [
                'type' => Type::int(),
                'description' => 'Last available page',
            ],
        ];
    }
}
