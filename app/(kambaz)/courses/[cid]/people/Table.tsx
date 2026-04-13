"use client";

import { useState } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "./Details";

export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: Record<string, unknown>[];
  fetchUsers: () => void | Promise<void>;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);

  return (
    <div id="wd-people-table">
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            void fetchUsers();
          }}
          fetchUsers={fetchUsers}
        />
      )}
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={String(user._id)}>
              <td className="wd-full-name text-nowrap">
                <span
                  role="button"
                  tabIndex={0}
                  className="text-decoration-none"
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(String(user._id));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowDetails(true);
                      setShowUserId(String(user._id));
                    }
                  }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">
                    {String(user.firstName ?? "")}
                  </span>{" "}
                  <span className="wd-last-name">
                    {String(user.lastName ?? "")}
                  </span>
                </span>
              </td>
              <td className="wd-login-id">{String(user.loginId ?? "")}</td>
              <td className="wd-section">{String(user.section ?? "")}</td>
              <td className="wd-role">{String(user.role ?? "")}</td>
              <td className="wd-last-activity">
                {user.lastActivity != null
                  ? String(user.lastActivity)
                  : ""}
              </td>
              <td className="wd-total-activity">
                {String(user.totalActivity ?? "")}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
