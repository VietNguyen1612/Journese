export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const dateString = (date: string) => {
  const res = date.substring(0, 10).split("-")
  return res[2] + "-" + res[1] + "-" + res[0]
}

export const dateString2 = (date: string) => {
  const res = date.substring(0, 10).split("-")
  return res[2] + "/" + res[1] + "/" + res[0].substring(2, 4)
}

export const returnFormattedDate = (date: string) => {
  let newdate = new Date(date);
  let day = String(newdate.getUTCDate()).padStart(2, '0');
  let month = String(newdate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript
  let year = newdate.getUTCFullYear();
  let hours = String(newdate.getUTCHours()).padStart(2, '0');
  let minutes = String(newdate.getUTCMinutes()).padStart(2, '0');
  let formattedDate = `${day}-${month}-${year}`;
  return formattedDate
}