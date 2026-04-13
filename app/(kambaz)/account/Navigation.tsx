"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const links = currentUser ? ["profile"] : ["signin", "signup"];
  const pathname = usePathname();

  return (
    <Nav variant="pills" className="flex-column">
      {links.map((link) => (
        <Nav.Item key={link}>
          <Nav.Link
            as={Link}
            href={`/account/${link}`}
            active={pathname.endsWith(link)}
          >
            {link === "signin"
              ? "Sign In"
              : link === "signup"
                ? "Sign Up"
                : "Profile"}
          </Nav.Link>
        </Nav.Item>
      ))}
      {currentUser && currentUser.role === "ADMIN" && (
        <Nav.Item>
          <Nav.Link
            as={Link}
            href="/account/users"
            active={pathname.includes("/account/users")}
          >
            Users
          </Nav.Link>
        </Nav.Item>
      )}
    </Nav>
  );
}
