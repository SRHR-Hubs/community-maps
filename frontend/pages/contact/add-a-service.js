// const Form = dynamic(
//   () => (
//     (<Jotform formURL="https://form.jotform.com/jsform/230260611235240" />),
//     {
//       ssr: false,
//       loading: () => "Loading...",
//     }
//   )
// );

import { useRouter } from "next/router";
import { useEffect } from "react";

const AddAServiceForm = () => {
  useEffect(() => {
    const router = useRouter();
    router.replace("https://form.jotform.com/230260611235240");
  }, []);

  return <div>loading</div>;
};

export default AddAServiceForm;
