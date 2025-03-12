<?php

namespace App\GraphQL\Queries;

use App\Models\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;

class UserSingleQuery extends Query
{

    protected $attributes = [
        'name' => 'User',
    ];

    public function type(): Type
    {
        return GraphQL::type('User');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
                'description' => 'The id of the User'
            ]
        ];
    }

    public function resolve($root, $args)
    {
        return User::findOrFail($args['id']);
    }
}
