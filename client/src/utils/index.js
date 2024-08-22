// export const formatDate = (date) => {
//   // Get the month, day, and year
//   const month = date.toLocaleString("en-US", { month: "short" })
//   const day = date.getDate()
//   const year = date.getFullYear()

//   const formattedDate = `${day}-${month}-${year}`

//   return formattedDate
// }

// export function dateFormatter(dateString) {
//   const inputDate = new Date(dateString)

//   if (isNaN(inputDate)) {
//       return "Invalid Date"
//   }

//   const year = inputDate.getFullYear()
//   const month = String(inputDate.getMonth() + 1).padStart(2, "0")
//   const day = String(inputDate.getDate()).padStart(2, "0")

//   const formattedDate = `${year}-${month}-${day}`
//   return formattedDate
// }


// export const formatTime = (date) => {
//   // Get the hours, minutes, and seconds
//   const hours = String(date.getHours()).padStart(2, "0")
//   const minutes = String(date.getMinutes()).padStart(2, "0")
//   const seconds = String(date.getSeconds()).padStart(2, "0")

//   const formattedTime = `${hours}:${minutes}:${seconds}`

//   return formattedTime
// }

// export function timeFormatter(timeString) {
//   const inputDate = new Date(`1970-01-01T${timeString}Z`)

//   if (isNaN(inputDate)) {
//       return "Invalid Time"
//   }

//   const hours = String(inputDate.getUTCHours()).padStart(2, "0")
//   const minutes = String(inputDate.getUTCMinutes()).padStart(2, "0")
//   const seconds = String(inputDate.getUTCSeconds()).padStart(2, "0")

//   const formattedTime = `${hours}:${minutes}:${seconds}`
//   return formattedTime
// }

export function getInitials(fullName) {
  const names = fullName.split(" ")

  const initials = names.slice(0, 2).map((name) => name[0])

  const initialsStr = initials.join("")

  return initialsStr
}

export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
}

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
}

export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
]
