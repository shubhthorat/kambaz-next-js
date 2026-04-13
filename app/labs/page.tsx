"use client";

import Link from "next/link";
import { Nav } from "react-bootstrap";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <p>Shubh Thorat</p>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} href="/labs/lab1" id="wd-lab1-link">
            Lab 1: HTML Examples
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href="/labs/lab2" id="wd-lab2-link">
            Lab 2: CSS Basics
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href="/labs/lab2/tailwind" id="wd-lab2-tailwind-link">
            Lab 2: Tailwind CSS
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href="/labs/lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href="/labs/lab4" id="wd-lab4-link">
            Lab 4: State Management
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href="/labs/lab5" id="wd-lab5-link">
            Lab 5: HTTP / REST
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <p className="mt-3">
        <a href="https://github.com/itsjustshubh/kambaz-next-js" id="wd-github">
          GitHub Repository
        </a>
      </p>
    </div>
  );
}
