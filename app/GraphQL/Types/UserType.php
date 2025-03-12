<?php

namespace App\GraphQL\Types;

use App\Models\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class UserType extends GraphQLType
{
    protected $attributes = [
        'name' => 'User',
        'description' => 'A User',
        'model' => User::class,
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
                'description' => 'The id of the user',
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The name of the user',
            ],
            'email' => [
                'type' => Type::string(),
                'description' => 'The email of the user',
            ],
            // 'password' => [
            //     'type' => Type::string(),
            //     'description' => 'The password of the user',
            // ],
            'profile_picture' => [
                'type' => Type::string(),
                'description' => 'The profile_picture of the user',
            ],
            'email_verified_at' => [
                'type' => Type::string(),
                'description' => 'The email_verified_at of the user',
            ],
            'created_at' => [
                'type' => Type::string(),
                'description' => 'The created_at of the user',
            ],
            'updated_at' => [
                'type' => Type::string(),
                'description' => 'The updated_at of the user',
            ]
        ];
    }
}
