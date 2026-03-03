import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SigninStudentAlias() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/signin");
  }, [router]);
  return null;
}
