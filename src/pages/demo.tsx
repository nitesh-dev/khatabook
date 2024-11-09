import Api from "@/lib/api/Api";
import { useEffect } from "react";

export default function Demo() {
  useEffect(() => {
    const fun = async () => {
      let r = await Api.createCustomer({
        name: "nitesh " + Math.random(),
        address: "bihar",
        email: "some@gmail.com",
        phone: "1234567890",
      });
      console.log(r);

      r = await Api.createCustomer({} as any);
      console.log(r);
    };
    fun();
  }, []);
  return <div>demo</div>;
}
