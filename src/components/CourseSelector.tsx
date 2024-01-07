import { ChangeEvent, useEffect, useState } from "react"

export default function CourseSelector({ courses, electiveIds, toggleElective }: { courses: any[], electiveIds: number[], toggleElective: Function }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses);

  // useEffect(() => {
  //   setFilteredCourses(courses);
  // })

  useEffect(() => {
    const results = courses.filter(
      (item) =>
        item.course_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.course_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredCourses(results);
  }, [searchQuery]);

  // update searchQuery
  const changeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  return <div className="bg-neutral-500 px-4 rounded-3xl py-5">
    <input
      type="text"
      placeholder="Search"
      onChange={(e) => changeQuery(e)}
      className="bg-neutral-600 rounded-full px-4 py-2 w-full"
    />
    <div style={{ height: "80vh", overflowY: "scroll" }}>
      {filteredCourses.map((course) => (
        <div key={course.course_id} className={`${electiveIds.includes(course.course_id) ? "bg-amber-400 hover:bg-amber-700" : "bg-neutral-700 hover:bg-neutral-800"} rounded-md py-2 my-1 px-5 text-neutral-100 font-bold cursor-pointer`} onClick={() => toggleElective(course.course_id)}>
          {course.course_no} {course.course_title}
        </div>
      ))}
    </div>
  </div>
}