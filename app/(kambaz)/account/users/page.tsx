"use client";

import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import PeopleTable from "../../courses/[cid]/people/Table";
import * as client from "../client";

export default function Users() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    const list = await client.findAllUsers();
    setUsers(list);
  };

  const filterUsersByRole = async (nextRole: string) => {
    setRole(nextRole);
    if (nextRole) {
      const list = await client.findUsersByRole(nextRole);
      setUsers(list);
    } else {
      await fetchUsers();
    }
  };

  const filterUsersByName = async (partial: string) => {
    setName(partial);
    if (partial) {
      const list = await client.findUsersByPartialName(partial);
      setUsers(list);
    } else {
      await fetchUsers();
    }
  };

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => void createUser()}
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        People
      </button>
      <h3>Users</h3>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <FormControl
          value={name}
          onChange={(e) => void filterUsersByName(e.target.value)}
          placeholder="Search people"
          className="float-start w-25 wd-filter-by-name"
        />
        <select
          value={role}
          onChange={(e) => void filterUsersByRole(e.target.value)}
          className="form-select float-start w-25 wd-select-role"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
