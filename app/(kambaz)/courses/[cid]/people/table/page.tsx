"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "../Table";
import * as client from "../../../client";

export default function CoursePeopleTablePage() {
  const { cid } = useParams();
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);

  const fetchUsers = useCallback(async () => {
    if (!cid) return;
    const list = await client.findUsersForCourse(cid as string);
    setUsers(list);
  }, [cid]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return <PeopleTable users={users} fetchUsers={fetchUsers} />;
}
