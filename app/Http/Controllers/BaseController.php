<?php

namespace App\Http\Controllers;

use App\Services\EncryptService;
use Illuminate\Routing\Controller;

class BaseController extends Controller
{
    protected EncryptService $encrypt;

    public function __construct()
    {
        $this->encrypt = new EncryptService();
    }
}