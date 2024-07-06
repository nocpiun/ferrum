import Nav from "@/components/nav";

export default function Layout({
  	children,
}: {
  	children: React.ReactNode;
}) {
  	return (
    	<div className="flex flex-col w-full h-[100vh]">
      		<Nav />
      		{children}
    	</div>
  	);
}
