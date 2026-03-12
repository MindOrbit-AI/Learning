import { UsersList } from "@/features/admin-users/users-list";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage platform users and roles
        </p>
      </div>
      <UsersList />
    </div>
  );
}
