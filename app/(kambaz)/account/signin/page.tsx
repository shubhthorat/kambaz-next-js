"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState<{
    username?: string;
    password?: string;
  }>({});
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = await client.signin({
        username: credentials.username ?? "",
        password: credentials.password ?? "",
      });
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/dashboard");
    } catch {}
  };

  return (
    <div id="wd-signin-screen" style={{ maxWidth: 400 }}>
      <h1>Sign In</h1>
      <Form.Control
        value={credentials.username ?? ""}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <Form.Control
        value={credentials.password ?? ""}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-2">
        Sign In
      </Button>
      <Link href="/account/signup" id="wd-signup-link">
        Sign Up
      </Link>
    </div>
  );
}
