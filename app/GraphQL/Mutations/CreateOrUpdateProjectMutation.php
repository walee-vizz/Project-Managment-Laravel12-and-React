<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Closure;
use App\Models\Project;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Log;
use Rebing\GraphQL\Support\SelectFields;
use Rebing\GraphQL\Support\Facades\GraphQL;

class CreateOrUpdateProjectMutation extends Mutation
{
    protected $attributes = [
        'name' => 'createOrUpdateProject',
        'description' => 'Create or update a project'
    ];

    public function type(): Type
    {
        return GraphQL::type('Project');
    }

    public function args(): array
    {
        return [
            'id' => ['name' => 'id', 'type' => Type::id()], // Optional for update
            'name' => ['name' => 'name', 'type' => Type::nonNull(Type::string())],
            'description' => ['name' => 'description', 'type' => Type::string()],
            'status' => ['name' => 'status', 'type' => Type::string()],
            // 'created_by' => ['name' => 'created_by', 'type' => Type::id()],
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        $fields = $getSelectFields();
        $select = $fields->getSelect();
        $with = $fields->getRelations();
        Log::info('Fields :' . json_encode($fields));
        $args['created_by'] = 1;
        $args['updated_by'] = 1;
        if (isset($args['id'])) {
            $project = Project::find($args['id']);
            if (!$project) {
                throw new \Exception('Project not found');
            }
            $project->update($args);
        } else {
            $project = Project::create($args);
        }
        return $project;
    }
}
