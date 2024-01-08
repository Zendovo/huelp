export default function Calendar({ midsemDates, compreDates }: { midsemDates: any, compreDates: any }) {
  return (
    <div className="bg-neutral-800 flex gap-8 w-full px-4 py-5 rounded-3xl shadow-2xl">
      <div className="bg-neutral-900 basis-1/2 rounded-xl px-3 py-4">
        <div className="text-center w-100 text-xl font-bold mb-5">MIDSEM DATES</div>
        {Object.keys(midsemDates).sort().map((date) => {
          const object = midsemDates[date];
          const month = date[1] == "3" ? "Mar" : "May";
          const day = date.substring(2);

          return (
            <div key={date} className="flex bg-neutral-700 rounded-lg py-4 mt-2 text-lg">
              <div className="basis-3/12 font-bold px-8">{day} {month}</div>
              <div className="basis-9/12 text-md px-8">
                {Object.keys(object).sort().map((session, index) => {
                  return (
                    <div key={session}>
                      {index > 0 && <div>------------</div>}
                      <div>{Object.keys(object[session]).map((course_no) => (<div key={course_no}>{object[session][course_no]}</div>))}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="bg-neutral-900 basis-1/2 rounded-xl px-3 py-4">
        <div className="text-center w-100 text-xl font-bold mb-5">COMPRE DATES</div>
        {Object.keys(compreDates).sort().map((date) => {
          const object = compreDates[date];
          const month = date[1] == "3" ? "Mar" : "May";
          const day = date.substring(2);

          return (
            <div key={date} className="flex bg-neutral-700 rounded-lg py-4 mt-2 text-lg">
              <div className="basis-3/12 font-bold px-8">{day} {month}</div>
              <div className="basis-9/12 text-md px-8">
                {Object.keys(object).sort().map((session, index) => {
                  return (
                    <div key={session}>
                      {index > 0 && <div>------------</div>}
                      <div>{Object.keys(object[session]).map((course_no) => (<div key={course_no}>{object[session][course_no]}</div>))}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}