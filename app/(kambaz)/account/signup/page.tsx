"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, FormSelect, Button, Form } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<Record<string, string>>({
    role: "STUDENT",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/account/profile");
    } catch {}
  };

  return (
    <div id="wd-signup-screen" className="wd-signup-screen" style={{ maxWidth: 400 }}>
      <h1>Sign up</h1>
      <FormControl
        value={user.username ?? ""}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="wd-username mb-2"
        placeholder="username"
      />
      <FormControl
        value={user.password ?? ""}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="wd-password mb-2"
        placeholder="password"
        type="password"
      />
      <Form.Label className="mb-1">I am signing up as</Form.Label>
      <FormSelect
        className="mb-2"
        value={user.role ?? "STUDENT"}
        onChange={(e) => setUser({ ...user, role: e.target.value })}
        aria-label="Account role"
      >
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Faculty</option>
      </FormSelect>
      <Button
        type="button"
        onClick={signup}
        className="wd-signup-btn btn btn-primary mb-2 w-100"
      >
        Sign up
      </Button>
      <br />
      <Link href="/account/signin" className="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}
