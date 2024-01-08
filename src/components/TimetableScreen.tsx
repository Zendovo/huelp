import Timetable from "./Timetable"
import { useEffect, useState } from "react";
import timetableData from "../testData";
import CourseSelector from "./CourseSelector";
import SectionSelector from "./SectionSelector";
import Calendar from "./Calendar";

export default function TimetableScreen() {
  // TT data
  const [timetable, setTimetable] = useState<Array<any>>([]); // Original Timetable Data
  const [importedSlots, setImportedSlots] = useState<any>(); // To check clashes

  // Elective data
  const [electives, setElectives] = useState<Array<any>>([]); // Electives Course Data in pure format
  // !!! This can get done away by directly updating the custom format
  // !!! To accomodate for choosing multiple sections from the same course things will need to changed significantly
  // !!! For the above, create custom electiveIds based on the selected sections for eg. concat: course_id + lecture + tutorial + practical
  // !!! and perform checks using the custom ids
  // !!! Why did I not do this? This would take longer <3 TECH DEBT <3
  const [electiveIds, setElectiveIds] = useState<Array<any>>([]); // IDs for faster search
  const [slottedElectives, setSlottedElectives] = useState({}); // Custom format for multiple clashing courses
  const [selector, setSelector] = useState(false);

  // Fetched data
  const [courses, setCourses] = useState<Array<any>>([]); // All Courses fetched
  const [midsemDates, setMidsemDates] = useState<{ [key: string]: { [key: string]: any } }>({});
  const [compreDates, setCompreDates] = useState<{ [key: string]: { [key: string]: any } }>({});

  // Imported Timetable Data
  useEffect(() => {
    let slots: any = {};
    timetableData.forEach((object) => {
      const { course_no, lecture, tutorial, practical } = object;

      const lectureSlots: number[] = lecture["slots"] || [];
      const tutorialSlots: number[] = tutorial["slots"] || [];
      const practicalSlots: number[] = practical["slots"] || [];

      [...lectureSlots, ...tutorialSlots, ...practicalSlots].forEach((slot) => slots[slot.toString()] = course_no)
    });

    setImportedSlots(slots);
    setTimetable(timetableData);

    const fetchData = async () => {
      // Fetch Midsem and Compre dates
      const oldMidsemDates = structuredClone(midsemDates);
      const oldCompreDates = structuredClone(compreDates);

      for (let i = 0; i < timetableData.length; i++) {
        const course = timetableData[i];
        const { course_id, course_no, course_title } = course;

        const response2 = await fetch(
          "https://timetable.bits-dvm.org/timetable/sections/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ course_id }),
          }
        );

        const courseDetails = await response2.json();

        const { midsem_date, midsem_session, compre_date, compre_session } = courseDetails;

        // MIDSEM DATES

        if (midsem_date != "" && midsem_session != undefined) {
          const midsemDate = midsem_date.split("/")[1] + midsem_date.split("/")[0] || "";
          const midsemSession = midsem_session[0] === "F" ? 0 : midsem_session[2] == 1 ? 1 : 2;

          const test = oldMidsemDates[midsemDate] || undefined;
          if (!test) {
            oldMidsemDates[midsemDate] = {};
          }

          const testtest = oldMidsemDates[midsemDate][midsemSession.toString()] || undefined;
          if (!testtest) {
            oldMidsemDates[midsemDate][midsemSession.toString()] = {};
          }
          oldMidsemDates[midsemDate][midsemSession.toString()][course_no] = course_title;
        }

        // COMPRE DATES

        if (compre_date != "" && midsem_session != undefined) {
          const compreDate = compre_date.split("/")[1] + compre_date.split("/")[0] || "";
          const compreSession = compre_session[0] === "F" ? 0 : compre_session[2] == 1 ? 1 : 2;

          const test = oldCompreDates[compreDate] || undefined;
          if (!test) {
            oldCompreDates[compreDate] = {};
          }

          const testtest = oldCompreDates[compreDate][compreSession.toString()] || undefined;
          if (!testtest) {
            oldCompreDates[compreDate][compreSession.toString()] = {};
          }
          oldCompreDates[compreDate][compreSession.toString()][course_no] = course_title;
        }
      }
      console.log(oldMidsemDates);
      setMidsemDates(oldMidsemDates);
      setCompreDates(oldCompreDates);
    }

    fetchData();
  }, []);

  // Fetch Courses
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://timetable.bits-dvm.org/timetable/courses/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bits_id: "2022A8PS0557P" }),
        }
      );

      const json = await response.json();

      setCourses(json.courses);
    }

    fetchData()
  }, []);

  // Check Clash
  const checkClash = (courseData: any) => {
    const { lecture, tutorial, practical } = courseData;
    const lectureSlots: number[] = lecture["slots"] || [];
    const tutorialSlots: number[] = tutorial["slots"] || [];
    const practicalSlots: number[] = practical["slots"] || [];

    const ttSlots: number[] = Object.keys(importedSlots).map(slot => Number(slot));

    const slots = [...lectureSlots, ...tutorialSlots, ...practicalSlots, ...ttSlots];
    const slotsSet = new Set(slots);
    if (slots.length != Array.from(slotsSet).length) {
      const toFindDuplicates = (arry: any[]) => arry.filter((item, index) => arry.indexOf(item) !== index)
      const duplicateElements = toFindDuplicates(slots);
      return [true, `Clash with ${importedSlots[`${duplicateElements[0]}`]}`]
    }

    return [false, null]
  }

  // Toggle Elective
  const toggleElective = (course_id: number) => {
    let exists = false;
    for (let i = 0; i < electiveIds.length; i++) {
      const elective = electiveIds[i];

      if (elective != course_id) continue;

      exists = true;
      break;
    }

    const fetchData = async () => {
      if (!exists) {

        const response = await fetch(
          "https://timetable.bits-dvm.org/timetable/sections/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ course_id }),
          }
        );

        const course = await response.json();

        // Check if course has only one section
        if (course.lecture.length <= 1 &&
          course.tutorial.length <= 1 &&
          course.practical.length <= 1) {
          const courseData = {
            course_id: course.course_id,
            course_no: course.course_no,
            course_title: course.course_title,
            lecture: course.lecture.length === 1 ? course.lecture[0] : [],
            tutorial: course.tutorial.length === 1 ? course.tutorial[0] : [],
            practical: course.practical.length === 1 ? course.practical[0] : [],
          }

          if (checkClash(courseData)[0]) return alert(checkClash(courseData)[1]);

          const { midsem_date, midsem_session, compre_date, compre_session, course_no, course_title } = course;

          // MIDSEM DATES

          if (midsem_date != "" && midsem_session != undefined) {
            const midsemDate = midsem_date.split("/")[1] + midsem_date.split("/")[0] || "";
            const midsemSession = midsem_session[0] === "F" ? 0 : midsem_session[2] == 1 ? 1 : 2;

            const oldMidsemDates = midsemDates;

            const test = oldMidsemDates[midsemDate] || undefined;
            if (!test) {
              oldMidsemDates[midsemDate] = {};
            }

            const testtest = oldMidsemDates[midsemDate][midsemSession.toString()] || undefined;
            if (!testtest) {
              oldMidsemDates[midsemDate][midsemSession.toString()] = {};
            }
            oldMidsemDates[midsemDate][midsemSession.toString()][course_no] = course_title;
            setMidsemDates(oldMidsemDates);
          }

          // COMPRE DATES

          if (compre_date != "" && midsem_session != undefined) {
            const compreDate = compre_date.split("/")[1] + compre_date.split("/")[0] || "";
            const compreSession = compre_session[0] === "F" ? 0 : compre_session[2] == 1 ? 1 : 2;

            const oldCompreDates = compreDates;

            const test = oldCompreDates[compreDate] || undefined;
            if (!test) {
              oldCompreDates[compreDate] = {};
            }

            const testtest = oldCompreDates[compreDate][compreSession.toString()] || undefined;
            if (!testtest) {
              oldCompreDates[compreDate][compreSession.toString()] = {};
            }
            oldCompreDates[compreDate][compreSession.toString()][course_no] = course_title;
            setCompreDates(oldCompreDates);
          }

          setElectives([...electives, courseData]);
          setElectiveIds([...electiveIds, course_id]);
          return
        }

        // Handle multi section course
        // Show section selector
        setSelector(true);

        return
      }

      setElectives(electives.filter((elective) => elective.course_id != course_id));
      setElectiveIds(electiveIds.filter((elective) => elective != course_id));
    }

    fetchData();

  };

  // Create the custom electives format on electives being updated
  useEffect(() => {
    let newSlottedElectives: any = {};
    for (let i = 0; i < electives.length; i++) {
      const elective = electives[i];
      const { course_no, course_title, lecture, tutorial, practical } = elective;

      const lectureSlots: number[] = lecture["slots"] || [];
      const tutorialSlots: number[] = tutorial["slots"] || [];
      const practicalSlots: number[] = practical["slots"] || [];

      lectureSlots.forEach((slot) => newSlottedElectives[slot.toString()] = [...newSlottedElectives[slot.toString()] || [], ([course_no, course_title, "L"])])
      tutorialSlots.forEach((slot) => newSlottedElectives[slot.toString()] = [...newSlottedElectives[slot.toString()] || [], ([course_no, course_title, "T"])])
      practicalSlots.forEach((slot) => newSlottedElectives[slot.toString()] = [...newSlottedElectives[slot.toString()] || [], ([course_no, course_title, "P"])])
    }

    setSlottedElectives(newSlottedElectives);
  }, [electives]);

  const closeSelector = () => {
    setSelector(false);
  };

  return (
    <div className="relative">
      <div className="text-4xl font-bold text-center pt-8">huelp</div>
      <div className="text-md text-center pt-2">kyuki IR nahi lena firse! ❤️</div>
      <Timetable timetable={timetable} slottedElectives={slottedElectives} />
      <div className="flex flex-col xl:flex-row mx-8 py-8 gap-12">
        <div className="xl:basis-8/12">
          <Calendar midsemDates={midsemDates} compreDates={compreDates} />
        </div>
        <div className="xl:basis-4/12">
          <CourseSelector courses={courses} electiveIds={electiveIds} toggleElective={toggleElective} />
        </div>
      </div>
      {selector && <SectionSelector closeSelector={closeSelector} />}
    </div>
  )
}
