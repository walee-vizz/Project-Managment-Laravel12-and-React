<?php

namespace App\Console\Commands;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Console\Command;

class MakeGraphQLType extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:graphql:type {model : The name of the model}';


    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new GraphQL type and query for a model';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $model = $this->argument('model');
        $modelClass = "App\\Models\\{$model}";

        if (!class_exists($modelClass)) {
            $this->error("Model {$modelClass} does not exist!");
            return 1;
        }

        // Create the Type
        $this->createType($model);

        // Create the Query
        $this->createQuery($model);

        $this->info("GraphQL type and query created for {$model}!");
        return 0;
    }

    protected function createType($model)
    {
        $modelClass = "App\\Models\\{$model}";
        $modelInstance = new $modelClass();
        $fillable = $modelInstance->getFillable();

        $typePath = app_path("GraphQL/Types/{$model}Type.php");
        $typeDir = dirname($typePath);

        if (!File::isDirectory($typeDir)) {
            File::makeDirectory($typeDir, 0755, true);
        }

        $fields = [];

        // Always include id
        $fields[] = $this->generateField('id', 'ID', true);

        // Add fillable attributes
        foreach ($fillable as $attribute) {
            $fields[] = $this->generateField($attribute, 'string');
        }

        // Add timestamps if they exist
        if ($modelInstance->timestamps) {
            $fields[] = $this->generateField('created_at', 'string');
            $fields[] = $this->generateField('updated_at', 'string');
        }

        $fieldString = implode(",\n            ", $fields);

        $typeContent = <<<EOT
<?php

namespace App\GraphQL\Types;

use App\Models\\{$model};
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class {$model}Type extends GraphQLType
{
    protected \$attributes = [
        'name' => '{$model}',
        'description' => 'A {$model}',
        'model' => {$model}::class,
    ];

    public function fields(): array
    {
        return [
            {$fieldString}
        ];
    }
}
EOT;

        File::put($typePath, $typeContent);
        $this->info("Created {$typePath}");
    }

    protected function createQuery($model)
    {
        $pluralModel = Str::plural(lcfirst($model));
        $queryPath = app_path("GraphQL/Queries/{$model}Query.php");
        $queriesDir = dirname($queryPath);

        if (!File::isDirectory($queriesDir)) {
            File::makeDirectory($queriesDir, 0755, true);
        }

        $queryContent = <<<EOT
<?php

namespace App\GraphQL\Queries;

use App\Models\\{$model};
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;

class {$model}Query extends Query
{
    protected \$attributes = [
        'name' => '{$pluralModel}',
    ];

    public function type(): Type
    {
        return Type::listOf(GraphQL::type('{$model}'));
    }

    public function resolve(\$root, \$args)
    {
        return {$model}::all();
    }
}
EOT;

        File::put($queryPath, $queryContent);
        $this->info("Created {$queryPath}");

        // Create single item query
        $singleQueryPath = app_path("GraphQL/Queries/{$model}SingleQuery.php");

        $singleQueryContent = <<<EOT
<?php

namespace App\GraphQL\Queries;

use App\Models\\{$model};
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Rebing\GraphQL\Support\Facades\GraphQL;

class {$model}SingleQuery extends Query
{
    protected \$attributes = [
        'name' => '{$model}',
    ];

    public function type(): Type
    {
        return GraphQL::type('{$model}');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
                'description' => 'The id of the {$model}'
            ]
        ];
    }

    public function resolve(\$root, \$args)
    {
        return {$model}::findOrFail(\$args['id']);
    }
}
EOT;

        File::put($singleQueryPath, $singleQueryContent);
        $this->info("Created {$singleQueryPath}");
    }

    protected function generateField($name, $type, $nonNull = false)
    {
        $typeFunc = match ($type) {
            'ID' => 'id',
            'string' => 'string',
            'integer' => 'int',
            'float' => 'float',
            'boolean' => 'boolean',
            default => 'string'
        };

        $typeStr = $nonNull ? "Type::nonNull(Type::{$typeFunc}())" : "Type::{$typeFunc}()";

        return "'{$name}' => [
                'type' => {$typeStr},
                'description' => 'The {$name} of the " . Str::singular($name) . "',
            ]";
    }
}
