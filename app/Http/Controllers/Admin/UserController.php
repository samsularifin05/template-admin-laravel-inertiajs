<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $search = trim((string) request('search', ''));
        $perPage = (int) request('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;

        $users = User::query()
            ->select(['id', 'username', 'name', 'email', 'no_hp', 'role', 'created_at'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery->where('username', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();

        $users->setCollection(
            $users->getCollection()->map(function (User $user) {
                $user->email = $this->encrypt->doDecrypt($user->email);
                $user->no_hp = $this->encrypt->doDecrypt($user->no_hp);

                return $user;
            })
        );


        return Inertia::render('admin/datamaster/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $this->encrypt->doEncrypt($validated['email']),
            'no_hp' => empty($validated['no_hp']) ? null : $this->encrypt->doEncrypt($validated['no_hp']),
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', 'User berhasil ditambahkan.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        $payload = [
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $this->encrypt->doEncrypt($validated['email']),
            'no_hp' => empty($validated['no_hp']) ? null : $this->encrypt->doEncrypt($validated['no_hp']),
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return redirect()
            ->route('users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        User::query()->whereKey($user->id)->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'User berhasil dihapus.');
    }
}
