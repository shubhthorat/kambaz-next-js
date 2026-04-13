"use client";

import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../account/client";

export default function PeopleDetails({
  uid,
  onClose,
  fetchUsers,
}: {
  uid: string | null;
  onClose: () => void;
  fetchUsers: () => void | Promise<void>;
}) {
  const [user, setUser] = useState<Record<string, unknown>>({});
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    if (!uid) return;
    const u = await client.findUserById(uid);
    setUser(u || {});
  };

  const deleteUser = async (id: string) => {
    await client.deleteUser(id);
    await fetchUsers();
    onClose();
  };

  const saveUser = async () => {
    const [firstName, ...rest] = name.trim().split(/\s+/);
    const lastName = rest.join(" ") || "";
    const updatedUser = {
      ...user,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
    };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    onClose();
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        type="button"
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil
            onClick={() => {
              setName(
                `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
              );
              setEditing(true);
            }}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}
        {editing && (
          <FaCheck
            onClick={() => saveUser()}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}
        {!editing && (
          <div
            className="wd-name"
            onClick={() => {
              setName(
                `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
              );
              setEditing(true);
            }}
          >
            {String(user.firstName ?? "")} {String(user.lastName ?? "")}
          </div>
        )}
        {editing && (
          <FormControl
            className="w-50 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void saveUser();
            }}
          />
        )}
      </div>
      <b>Roles:</b>{" "}
      <span className="wd-roles">{String(user.role ?? "")}</span>
      <br />
      <b>Login ID:</b>{" "}
      <span className="wd-login-id">{String(user.loginId ?? "")}</span>
      <br />
      <b>Section:</b>{" "}
      <span className="wd-section">{String(user.section ?? "")}</span>
      <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">
        {String(user.totalActivity ?? "")}
      </span>
      <hr />
      <button
        type="button"
        onClick={() => void deleteUser(uid)}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-secondary float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}
