<?php

namespace App\Http\Controllers\Map;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Point;

class PointController extends Controller
{
    public function index()
    {
        // die("lkjlkjlkjlk");
        return Point::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title1' => 'required|string',
            'title2' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);
        return Point::create($request->all());
    }

    public function update(Request $request, Point $point)
    {
        $request->validate([
            'title1' => 'required|string',
            'title2' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);
        $point->update($request->all());
        return $point;
    }

    public function delete(Point $point)
    {
        $point->delete();
        return response()->json(['success' => true]);
    }
}
