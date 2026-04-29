<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            // Internal Management
            'manage users',
            'view analytics',
            
            // Student & Academic Management
            'view students', 'create students', 'edit students', 'delete students',
            'view sections', 'create sections', 'edit sections', 'delete sections',
            
            // Performance & Registry
            'view grades', 'manage grades',
            'view attendance', 'manage attendance',
            'view behavior', 'manage behavior',
            'view health', 'manage health',
            
            // Documents
            'view documents', 'upload documents', 'delete documents',
        ];

        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::updateOrCreate(['name' => $permission]);
        }

        // Remove old roles not needed anymore
        \Spatie\Permission\Models\Role::whereIn('name', ['teacher', 'parent', 'student', 'admin', 'staff', 'viewer'])->delete();

        // Create Roles and Assign Permissions
        
        // Dean (Super Admin) - Full access
        $deanRole = \Spatie\Permission\Models\Role::updateOrCreate(['name' => 'dean']);
        $deanRole->givePermissionTo(\Spatie\Permission\Models\Permission::all());

        // Professor
        $professorRole = \Spatie\Permission\Models\Role::updateOrCreate(['name' => 'professor']);
        $professorRole->givePermissionTo([
            'view students', 'create students', 'edit students',
            'view sections',
            'view grades', 'manage grades',
            'view attendance', 'manage attendance',
            'view behavior', 'manage behavior',
            'view health', 'manage health',
            'view documents', 'upload documents',
        ]);

        // Secretary
        $secretaryRole = \Spatie\Permission\Models\Role::updateOrCreate(['name' => 'secretary']);
        $secretaryRole->givePermissionTo([
            'view students', 'create students', 'edit students',
            'view sections', 'create sections', 'edit sections',
            'view documents', 'upload documents',
        ]);

        // Students
        $studentRole = \Spatie\Permission\Models\Role::updateOrCreate(['name' => 'students']);
        $studentRole->givePermissionTo([
            'view students', // Their own
            'view grades',
            'view attendance',
            'view behavior',
            'view health',
            'view documents',
        ]);
    }
}
