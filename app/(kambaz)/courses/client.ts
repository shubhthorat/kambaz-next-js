import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER!;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`
  );
  return data;
};

export const createCourse = async (course: Record<string, unknown>) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};

export const deleteCourse = async (id: string) => {
  await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
};

export const updateCourse = async (course: { _id: string }) => {
  await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
};

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/modules`
  );
  return data;
};

export const createModuleForCourse = async (
  courseId: string,
  module: Record<string, unknown>
) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return data;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}/modules/${moduleId}`
  );
  return data;
};

export const updateModule = async (
  courseId: string,
  module: Record<string, unknown> & { _id: string }
) => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${courseId}/modules/${module._id}`,
    module
  );
  return data;
};

export const enrollInCourse = async (courseId: string) => {
  await axiosWithCredentials.post(
    `${USERS_API}/current/enrollments/${courseId}`
  );
};

export const unenrollFromCourse = async (courseId: string) => {
  await axiosWithCredentials.delete(
    `${USERS_API}/current/enrollments/${courseId}`
  );
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/users`
  );
  return data;
};
