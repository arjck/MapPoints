// app/Http/Kernel.php
<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // ... other middleware
        // \Fruitcake\Cors\HandleCors::class, // Remove this line
        // \Illuminate\Http\Middleware\HandleCors::class // Remove this line
    ];

    // ... rest of the code
}
