"use client";

export default function EventObject() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    alert(
      `Event type: ${e.type}\nTarget id: ${target.id}\nTarget tagName: ${target.tagName}`
    );
  };

  return (
    <div id="wd-event-object">
      <h2>Event Object</h2>
      <button
        onClick={handleClick}
        id="wd-event-object-click"
        className="btn btn-primary"
      >
        Click to see event object
      </button>
      <p className="mt-2 small text-muted">
        The handler uses e.preventDefault(), e.type, and e.target
      </p>
      <hr />
    </div>
  );
}
