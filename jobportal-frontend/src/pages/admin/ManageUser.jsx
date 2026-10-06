import { useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Dropdown } from "@/components/ui/Dropdown";
import { QueryState } from "@/components/ui/QueryState";
import { useAdminUsers, useToggleUserBlock } from "@/hooks/useAdmin";
import { formatDate } from "@/utils/formatters";
import { USER_ROLES } from "@/utils/constants";

// Admins aren't listed here at all (see adminService.js / backend
// users() filter) — only Seeker and Employer are real options.
const ROLE_FILTER_OPTIONS = [
  { label: "All roles", value: "" },
  { label: "Job Seeker", value: USER_ROLES.SEEKER },
  { label: "Employer", value: USER_ROLES.EMPLOYER },
];

const ROLE_BADGE_TONE = {
  [USER_ROLES.SEEKER]: "neutral",
  [USER_ROLES.EMPLOYER]: "brand",
};

export function ManageUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const filters = { search: search || undefined, role: role || undefined };
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useAdminUsers(filters);
  const { mutate: toggleBlock, isPending: isToggling } = useToggleUserBlock();

  const handleToggleBlock = (user) => {
    toggleBlock(user.id, {
      onSuccess: (updated) =>
        toast.success(
          updated.isBlocked ? `${user.name} blocked` : `${user.name} unblocked`,
        ),
      onError: (err) =>
        toast.error(err.message ?? "Could not update this user"),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Manage users</h1>
          <p className="mt-1 text-sm text-accent">
            {isLoading
              ? "Loading…"
              : `${users.length} user${users.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email"
          className="sm:flex-1"
        />
        <Dropdown
          options={ROLE_FILTER_OPTIONS}
          value={role}
          onChange={setRole}
          placeholder="All roles"
          className="sm:w-48"
        />
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load users"
      >
        <Card className="mt-6 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/10 text-xs uppercase text-accent">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Name
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Email
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Role
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Joined
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-primary/5"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-medium text-text">{user.name}</p>
                    {user.companyName && (
                      <p className="text-xs text-accent">{user.companyName}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge
                      tone={ROLE_BADGE_TONE[user.role] ?? "neutral"}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      onClick={() => handleToggleBlock(user)}
                      disabled={isToggling}
                      className="w-fit focus:outline-none disabled:opacity-50"
                      aria-label={
                        user.isBlocked
                          ? `Unblock ${user.name}`
                          : `Block ${user.name}`
                      }
                    >
                      <Badge tone={user.isBlocked ? "danger" : "success"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-accent">
              <UsersIcon className="h-6 w-6" />
              No users match your filters.
            </div>
          )}
        </Card>
      </QueryState>
    </div>
  );
}
