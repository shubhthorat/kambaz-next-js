"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Session({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await client.profile();
        dispatch(setCurrentUser(currentUser));
      } catch {
        dispatch(setCurrentUser(null));
      } finally {
        setPending(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  if (pending) {
    return (
      <div className="p-4 text-muted" id="wd-session-loading">
        Loading session…
      </div>
    );
  }

  return <>{children}</>;
}
