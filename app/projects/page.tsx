import Sidebar from "@/app/components/Sidebar";

export default function Projects() {
  return (
    <>
      <Sidebar />
      <main className="relative flex-1 flex flex-col bg-background">
        <div className="p-6">
          <h1 className="font-sans font-thin text-[67px] leading-[75px] text-white">
            /proof_of_work
          </h1>
        </div>
      </main>
    </>
  );
}
