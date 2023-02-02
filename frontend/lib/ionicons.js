// NOTE: There is a SIGNIFICANT TODO here.
/* I wish that I could do some dynamic-import magic to get the icons I need out of
this pack, but React/Next isn't very happy with that right now.
*/

import dynamic from "next/dynamic";

// const GetIcon = (icon) => {
//   const path = `ionicons/dist/ionicons/svg/${icon}.svg`;
//   console.log(path)
//   return dynamic(() => import("" + path), {
//     ssr: false,
//     loading: () => <p>loading</p>,
//   });
// };

const getIcon = (icon) =>
  dynamic(() => import(`ionicons/dist/ionicons/svg/${icon}.svg`), {
    ssr: false,
  });

export default getIcon;
export const Twitter = getIcon("logo-twitter");
export const Instagram = getIcon("logo-instagram");
