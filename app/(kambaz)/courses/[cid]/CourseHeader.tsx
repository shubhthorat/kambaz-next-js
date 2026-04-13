"use client";

import { usePathname } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";

interface Course {
  _id: string;
  name: string;
  number: string;
  description: string;
}

export default function CourseHeader({
  course,
  onToggleSidebar,
}: {
  course?: Course;
  onToggleSidebar?: () => void;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const courseIndex = segments.indexOf("courses");
  const afterCourse = courseIndex >= 0 ? segments.slice(courseIndex + 2) : [];
  const pageName =
    afterCourse.length > 0 ? afterCourse[afterCourse.length - 1] : "";
  const formattedPage = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  const breadcrumb = formattedPage ? ` > ${formattedPage}` : "";

  return (
    <h2 className="text-danger">
      <FaAlignJustify
        className="me-4 fs-4 mb-1"
        style={{ cursor: "pointer" }}
        onClick={onToggleSidebar}
        role="button"
        aria-label="Toggle course navigation"
      />
      {course?.name || "Course"}
      {breadcrumb}
    </h2>
  );
}
