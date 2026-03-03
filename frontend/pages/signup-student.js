// A garder, page d'alias car le backend renvoie signup-student (avec tiret)

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignupStudentAlias() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) router.replace(`/signup_student?token=${token}`);
  }, [token, router]);

  return null;
}
