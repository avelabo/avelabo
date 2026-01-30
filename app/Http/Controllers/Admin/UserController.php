<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->with(['roles:id,name,slug', 'seller:id,user_id,shop_name,status']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('slug', $request->role));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(15)->withQueryString();

        $users->through(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => $user->status,
            'email_verified_at' => $user->email_verified_at?->format('M d, Y'),
            'roles' => $user->roles->pluck('name')->toArray(),
            'is_seller' => $user->seller !== null,
            'seller_status' => $user->seller?->status,
            'created_at' => $user->created_at->format('M d, Y'),
            'last_login_at' => $user->last_login_at?->format('M d, Y H:i'),
        ]);

        $roles = Role::all(['id', 'name', 'slug']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role', 'status', 'sort', 'direction']),
        ]);
    }

    public function admins(Request $request)
    {
        $query = User::query()
            ->with(['roles:id,name,slug'])
            ->whereHas('roles', fn ($q) => $q->where('slug', 'admin'));

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(15)->withQueryString();

        $users->through(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => $user->status,
            'email_verified_at' => $user->email_verified_at?->format('M d, Y'),
            'roles' => $user->roles->pluck('name')->toArray(),
            'created_at' => $user->created_at->format('M d, Y'),
            'last_login_at' => $user->last_login_at?->format('M d, Y H:i'),
        ]);

        $roles = Role::all(['id', 'name', 'slug']);

        return Inertia::render('Admin/Users/Admins', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function sellers(Request $request)
    {
        $query = User::query()
            ->with(['roles:id,name,slug', 'seller:id,user_id,shop_name,status,rating'])
            ->whereHas('seller');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%")
                    ->orWhereHas('seller', fn ($sq) => $sq->where('shop_name', 'ilike', "%{$search}%"));
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('seller_status')) {
            $query->whereHas('seller', fn ($q) => $q->where('status', $request->seller_status));
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(15)->withQueryString();

        $users->through(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => $user->status,
            'email_verified_at' => $user->email_verified_at?->format('M d, Y'),
            'roles' => $user->roles->pluck('name')->toArray(),
            'seller' => $user->seller ? [
                'id' => $user->seller->id,
                'shop_name' => $user->seller->shop_name,
                'status' => $user->seller->status,
                'rating' => $user->seller->rating,
            ] : null,
            'created_at' => $user->created_at->format('M d, Y'),
            'last_login_at' => $user->last_login_at?->format('M d, Y H:i'),
        ]);

        return Inertia::render('Admin/Users/Sellers', [
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'seller_status', 'sort', 'direction']),
        ]);
    }

    public function customers(Request $request)
    {
        $query = User::query()
            ->with(['roles:id,name,slug'])
            ->whereHas('roles', fn ($q) => $q->where('slug', 'customer'))
            ->whereDoesntHave('seller');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(15)->withQueryString();

        $users->through(function ($user) {
            $totalOrders = $user->orders()->count();
            $totalSpent = $user->orders()->whereNotNull('paid_at')->sum('total');

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'email_verified_at' => $user->email_verified_at?->format('M d, Y'),
                'total_orders' => $totalOrders,
                'total_spent' => (float) $totalSpent,
                'created_at' => $user->created_at->format('M d, Y'),
                'last_login_at' => $user->last_login_at?->format('M d, Y H:i'),
            ];
        });

        return Inertia::render('Admin/Users/Customers', [
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function show(User $user)
    {
        $user->load([
            'roles:id,name,slug',
            'seller:id,user_id,shop_name,status,logo,rating',
            'addresses.country',
            'orders' => fn ($q) => $q->latest()->take(10),
        ]);

        $stats = [
            'total_orders' => $user->orders()->count(),
            'total_spent' => $user->orders()->whereNotNull('paid_at')->sum('total'),
            'addresses_count' => $user->addresses()->count(),
        ];

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'email_verified_at' => $user->email_verified_at?->format('M d, Y H:i'),
                'phone_verified_at' => $user->phone_verified_at?->format('M d, Y H:i'),
                'roles' => $user->roles,
                'seller' => $user->seller,
                'addresses' => $user->addresses,
                'created_at' => $user->created_at->format('M d, Y H:i'),
                'last_login_at' => $user->last_login_at?->format('M d, Y H:i'),
            ],
            'stats' => $stats,
            'recentOrders' => $user->orders->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at->format('M d, Y'),
            ]),
            'roles' => Role::all(['id', 'name', 'slug']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'status' => $validated['status'],
        ]);

        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return back()->with('success', 'User updated successfully.');
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user->update(['status' => $validated['status']]);

        return back()->with('success', 'User status updated successfully.');
    }

    public function updateRoles(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['exists:roles,id'],
        ]);

        $user->roles()->sync($validated['roles']);

        return back()->with('success', 'User roles updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->isAdmin() && User::whereHas('roles', fn ($q) => $q->where('slug', 'admin'))->count() <= 1) {
            return back()->with('error', 'Cannot delete the last admin user.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password reset successfully.');
    }
}
