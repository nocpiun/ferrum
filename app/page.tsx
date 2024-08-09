import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { tokenStorageKey } from "@/lib/global";
import { validateToken } from "@/lib/token";

export default function Page() {
	const cookieStore = cookies();
	const token = cookieStore.get(tokenStorageKey);

	if(!token || !validateToken(token.value)) redirect("/login");

	// default redirection
	redirect("/explorer");
}
