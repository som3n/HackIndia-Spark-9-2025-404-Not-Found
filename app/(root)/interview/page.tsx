import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
    getInterviewsByUserId,
    getLatestInterviews,
    getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import Header from "@/components/Header";
import Link from "next/link";

async function page() {
    const user = await getCurrentUser();

    const [userInterviews, allInterview] = await Promise.all([
        getInterviewsByUserId(user?.id!),
        getLatestInterviews({ userId: user?.id! }),
    ]);

    const hasPastInterviews = userInterviews?.length! > 0;
    const hasUpcomingInterviews = allInterview?.length! > 0;

    const feedbackPromises = userInterviews.map(interview =>
        getFeedbackByInterviewId({ interviewId: interview.id, userId: user?.id! })
    );

    const feedbackData = await Promise.all(feedbackPromises);

    // Calculate average scores for totalScore and categoryScores
    const averageScores = feedbackData.map(feedback => feedback?.totalScore).filter(score => score !== undefined);
    const averageScore = averageScores.length > 0 ? averageScores.reduce((a, b) => a + b) / averageScores.length : 0;

    // Calculate averages for category scores
    const categoryScores = feedbackData.flatMap(feedback => feedback?.categoryScores || []);
    const categoryAverageScores = {};

    categoryScores.forEach(category => {
        if (!categoryAverageScores[category.name]) {
            categoryAverageScores[category.name] = { total: 0, count: 0 };
        }
        categoryAverageScores[category.name].total += category.score;
        categoryAverageScores[category.name].count += 1;
    });

    const averageCategoryScores = Object.fromEntries(
        Object.entries(categoryAverageScores).map(([name, { total, count }]) => [name, total / count])
    );

    return (
        <div className="flex space-x-2 px-4">
            <div className="flex flex-col items-start space-y-4  w-[75vw]">
                <div className="interview-card p-4 bg-stone-800 mt-4 w-[95%] rounded-lg flex flex-col space-y-2">
                    <h3 className="text-lg">Lets personalize your next interview practice!</h3>
                    <p className="text-sm">Lets have a small interaction to build your interview!</p>
                    <Link href="/take-interview" className="bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors ease-in-out duration-500 px-4 py-2 w-1/3">Create your next Interview</Link>
                </div>
                <div className="flex flex-col gap-6 mt-4">
                    <div className="interviews-section">
                        {hasPastInterviews ? (
                            userInterviews?.map((interview) => (
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
                            <p>You haven&apos;t taken any interviews yet</p>
                        )}
                    </div>
                </div>
            </div>
            <section className="flex flex-col w-[25vw] p-4">
                <h2 className="text-xl pb-2 pt-4">Average Interview Score:</h2>
                <p className="text-3xl font-bold text-center transition-transform transform hover:scale-105">
                    {averageScore.toFixed(0)}/100
                </p>

                <h3 className="text-xl pb-2 pt-4">Performance Score:</h3>
                {Object.entries(averageCategoryScores).map(([category, avgScore]) => (
                    <section key={category} className="flex items-center justify-between p-2 border-b border-gray-300">
                        <p className="text-sm font-medium">{category}</p>
                        <p className="text-lg font-semibold transition-transform transform hover:scale-105">
                            {avgScore.toFixed()}/100
                        </p>
                    </section>
                ))}
            </section>
        </div>
    );
}

export default page;
