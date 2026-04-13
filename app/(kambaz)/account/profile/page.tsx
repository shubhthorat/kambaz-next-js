"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, Form } from "react-bootstrap";
import * as client from "../client";

function field(v: unknown) {
  return v == null ? "" : String(v);
}

export default function Profile() {
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const updateProfile = async () => {
    const updated = await client.updateUser(profile);
    dispatch(setCurrentUser(updated));
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/account/signin");
  };

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
      return;
    }
    setProfile(currentUser);
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div id="wd-profile-screen" style={{ maxWidth: 500 }}>
      <h3>Profile</h3>
      {profile && (
        <div>
          <Form.Control
            id="wd-username"
            className="mb-2"
            value={field(profile.username)}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <Form.Control
            id="wd-password"
            className="mb-2"
            value={field(profile.password)}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
            type="password"
          />
          <Form.Control
            id="wd-firstname"
            className="mb-2"
            value={field(profile.firstName)}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <Form.Control
            id="wd-lastname"
            className="mb-2"
            value={field(profile.lastName)}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <Form.Control
            id="wd-dob"
            className="mb-2"
            type="date"
            value={field(profile.dob)}
            onChange={(e) =>
              setProfile({ ...profile, dob: e.target.value })
            }
          />
          <Form.Control
            id="wd-email"
            className="mb-2"
            value={field(profile.email)}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />
          <select
            className="form-control mb-2"
            id="wd-role"
            value={field(profile.role) || "USER"}
            onChange={(e) =>
              setProfile({ ...profile, role: e.target.value })
            }
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="TA">TA</option>
            <option value="STUDENT">Student</option>
          </select>
          <Button
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
            id="wd-update-profile-btn"
          >
            Update
          </Button>
          <Button
            onClick={signout}
            className="w-100 mb-2 btn-danger wd-signout-btn"
            id="wd-signout-btn"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
