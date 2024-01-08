export default function Timetable({ timetable, slottedElectives }: { timetable: Array<any>, slottedElectives: any }) {

  return (
    <div className="max-w-screen-xl mx-auto pt-12" style={{ minHeight: "100vh" }}>
      <div className="grid grid-cols-7 grid-rows-12 gap-1 border-2 rounded-lg border-neutral-400 bg-neutral-900 shadow-2xl" style={{ minHeight: "72vh" }}>
        <div
          className="row-start-1 row-end-2 bg-neutral-800 rounded-md text-center py-3"
          style={{ borderTopLeftRadius: "7.626px" }}
        ></div>
        <div className="row-start-1 row-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <span className="hidden xl:block">Monday</span>
          <span className="xl:hidden">M</span>
        </div>
        <div className="row-start-1 row-end- bg-neutral-800 rounded-md text-center py-3 font-bold">
          <span className="hidden xl:block">Tuesday</span>
          <span className="xl:hidden">T</span>
        </div>
        <div className="row-start-1 row-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <span className="hidden xl:block">Wednesday</span>
          <span className="xl:hidden">W</span>
        </div>
        <div className="row-start-1 row-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <span className="hidden xl:block">Thursday</span>
          <span className="xl:hidden">Th</span>
        </div>
        <div className="row-start-1 row-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <span className="hidden xl:block">Friday</span>
          <span className="xl:hidden">F</span>
        </div>
        <div
          className="row-start-1 row-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold"
          style={{ borderTopRightRadius: "7.626px" }}
        >
          <span className="hidden xl:block">Saturday</span>
          <span className="xl:hidden">S</span>
        </div>

        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">8:00 - 9:00</div>
          <div className="xl:hidden">8 - 9</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">9:00 - 10:00</div>
          <div className="xl:hidden">9 - 10</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">10:00 - 11:00</div>
          <div className="xl:hidden">10 - 11</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">11:00 - 12:00</div>
          <div className="xl:hidden">11 - 12</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">12:00 - 13:00</div>
          <div className="xl:hidden">12 - 13</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">13:00 - 14:00</div>
          <div className="xl:hidden">13 - 14</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">14:00 - 15:00</div>
          <div className="xl:hidden">14 - 15</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">15:00 - 16:00</div>
          <div className="xl:hidden">15 - 16</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">16:00 - 17:00</div>
          <div className="xl:hidden">16 - 17</div>
        </div>
        <div className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold">
          <div className="hidden xl:block">17:00 - 18:00</div>
          <div className="xl:hidden">17 - 18</div>
        </div>
        <div
          className="col-start-1 col-end-2 bg-neutral-800 rounded-md text-center py-3 font-bold"
          style={{ borderBottomLeftRadius: "7.626px" }}
        >
          <div className="hidden xl:block">18:00 - 19:00</div>
          <div className="xl:hidden">18 - 19</div>
        </div>

        {timetable?.map((object, _index) => {
          const { course_no, lecture, tutorial, practical } = object;

          const lectureSlots: number[] = lecture["slots"] || [];
          const tutorialSlots: number[] = tutorial["slots"] || [];
          const practicalSlots: number[] = practical["slots"] || [];

          function getGridRow(slot: number): number {
            return slot % 20 + 2;
          }

          function getGridCol(slot: number): number {
            return Math.round(slot / 20) + 2;
          }

          return (
            <>
              {
                lectureSlots.sort().map((slot) => (
                  <div className="bg-cyan-800 rounded-md text-center py-3" style={{
                    gridColumn: getGridCol(slot),
                    gridRow: getGridRow(slot),
                  }}>{course_no}</div>
                ))
              }

              {
                tutorialSlots.sort().map((slot) => (
                  <div className="bg-cyan-900 rounded-md text-center py-3" style={{
                    gridColumn: getGridCol(slot),
                    gridRow: getGridRow(slot),
                  }}>{course_no}</div>
                ))
              }

              {
                practicalSlots.sort().map((slot) => (
                  <div className="bg-indigo-900 rounded-md text-center py-3" style={{
                    gridColumn: getGridCol(slot),
                    gridRow: getGridRow(slot),
                  }}>{course_no}</div>
                ))
              }
            </>
          )
        })}

        {Object.keys(slottedElectives).map((slot, _index) => {
          const courses = slottedElectives[slot];
          const nSlot = Number(slot);

          function getGridRow(slot: number): number {
            return slot % 20 + 2;
          }

          function getGridCol(slot: number): number {
            return Math.round(slot / 20) + 2;
          }

          return (
            <>
              <div className="bg-amber-500 border-2 border-amber-300 font-bold rounded-md text-center py-3 text-sm" style={{
                gridColumn: getGridCol(nSlot),
                gridRow: getGridRow(nSlot),
              }}>{courses.map((object: number[]) => (<div className="mt-2">{object[1]}</div>))}</div>
            </>
          )
        })}
      </div>
    </div>
  )
}
