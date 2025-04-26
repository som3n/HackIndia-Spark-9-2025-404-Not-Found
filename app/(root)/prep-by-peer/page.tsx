import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import Header from "@/components/Header";
import Link from "next/link";

async function page() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <div>
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="w-full text-center text-2xl">Interviews made by your peers</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="w-full text-center">Your Peers has not started yet, meanwhile you can <Link href="/interview" className="text-blue-400">create your own interview</Link>.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default page;
