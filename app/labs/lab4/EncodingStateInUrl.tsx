"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function EncodingStateInUrl() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [paramName, setParamName] = useState("category");
  const [paramValue, setParamValue] = useState("books");

  const paramsList = Array.from(searchParams.entries());

  const handleSetQueryParam = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams.toString());
    next.set(paramName, paramValue);
    router.replace(`${pathname}?${next.toString()}`);
  };

  const handleClearParams = () => {
    router.replace(pathname);
  };

  return (
    <div id="wd-encoding-state-in-url">
      <h2>Encoding State in URL</h2>

      <h3 className="h6 mt-3">Query Search Parameters</h3>
      <p className="small text-muted">
        Query parameters live after ? in the URL (e.g. /products?category=books&sort=price-desc).
      </p>
      <p>
        Current URL: <code className="small">{pathname}{searchParams.toString() ? `?${searchParams.toString()}` : ""}</code>
      </p>
      {paramsList.length > 0 && (
        <ul id="wd-query-params-list">
          {paramsList.map(([k, v]) => (
            <li key={k}>
              <strong>{k}</strong> = {v}
            </li>
          ))}
        </ul>
      )}
      <Form onSubmit={handleSetQueryParam} className="mb-2">
        <Form.Control
          id="wd-query-param-name"
          className="mb-1"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
          placeholder="Param name"
        />
        <Form.Control
          id="wd-query-param-value"
          className="mb-1"
          value={paramValue}
          onChange={(e) => setParamValue(e.target.value)}
          placeholder="Param value"
        />
        <Button type="submit" id="wd-set-query-param-click" className="me-2">
          Set query param
        </Button>
        <Button type="button" variant="secondary" onClick={handleClearParams}>
          Clear params
        </Button>
      </Form>

      <h3 className="h6 mt-4">Path Parameters</h3>
      <p className="small text-muted">
        Path parameters are segments in the URL path (e.g. /courses/RS101). Use <code>useParams()</code> in a dynamic route to read them.
      </p>
      <p>
        Current path: <code className="small">{pathname}</code>
      </p>

      <hr />
    </div>
  );
}
