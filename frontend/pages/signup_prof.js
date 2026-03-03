import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SigninProfAlias() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/signin");
  }, [router]);
  return null;
}
