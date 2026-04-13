"use client";

import { ReactNode, useState } from "react";
import CourseNavigation from "./Navigation";
import CourseHeader from "./CourseHeader";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";

export default function CoursesLayout({
  children,
}: { children: ReactNode }) {
  const { cid } = useParams();
  const { courses } = useSelector(
    (state: RootState) => state.coursesReducer
  );
  const course = courses.find((c: any) => c._id === cid);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div id="wd-courses">
      <CourseHeader
        course={course}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <hr />
      <div className="d-flex">
        {sidebarOpen && (
          <div className="d-none d-md-block">
            <CourseNavigation cid={cid as string} />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
