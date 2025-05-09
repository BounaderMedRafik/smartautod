import LandingPageLoginBlock from "@/components/LandingPageLoginBlock";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-[url('https://www.augustgarage.ca/wp-content/uploads/2022/11/august-garage-kelowna-european-auto-repair-performance-modification-1024x683.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="flex flex-col md:flex-row md:min-w-md items-center justify-center  h-96">
        {/* <LandingPageInfoBlock /> */}
        <LandingPageLoginBlock />
      </div>
    </div>
  );
}
