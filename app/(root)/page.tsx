import InterviewCard from "@/components/InterviewCard";
import LineChart from "@/components/LineChart";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
// import Header from "@/components/Header";
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

  // Prepare data for the line chart
  const interviewLabels = userInterviews.map(interview => `Interview: ${interview.role}`);
  const interviewScores = feedbackData.map(feedback => feedback?.totalScore || 0);

  const totalInterviewsTaken = feedbackData.filter(feedback => feedback !== undefined).length;

  return (
    <div className="flex space-x-2 px-4">
      <section className="flex flex-col items-start space-y-4 w-[50vw]">
        <div className="flex flex-col items-start space-y-4">
          <div className="interviews-summary flex space-x-4">
            <div className="flex flex-col space-y-2 interview-card w-2/5 bg-stone-800 p-4 rounded shadow">
              <h3 className="text-lg font-semibold">Want prepare for next big opportunity?</h3>
              {totalInterviewsTaken ? <p className="text-sm">Just give answer to few questions and create you own personalized interview</p> : <p> No Interview Taken yet!</p>}
              <Link className="bg-green-700 hover:bg-green-500 transition-all ease-in-out text-sm duration-500 px-4 py-2 rounded-lg w-2/3" href="/take-interview">Create an Interview</Link>
            </div>
            <div className="flex flex-col justify-between interview-card bg-stone-800 p-4 rounded shadow">
              <h3 className="text-lg font-semibold">Total Number Interviews</h3>
              {totalInterviewsTaken ? <p className="text-2xl">{totalInterviewsTaken} <span className="text-sm">interviews present</span></p> : <p> No Interview Taken yet!</p>}
              <Link className="bg-blue-700 hover:bg-blue-500 transition-all ease-in-out duration-500 text-sm px-4 py-2 rounded-lg" href="/interview">Practice on present interview</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <h1 className="text-xl font-semibold">Applying for your next big opportunity? Want a cover letter? Let us cover you!</h1>
          <span className="text-sm text-gray-400">Create a detailed cover letter curated by AI!</span>
          <Link href="/cover" className="px-4 py-2 bg-blue-600 hover:bg-blue-400 transition-colors ease-in-out duration-400 rounded-lg ml-2">Create Cover Letter!</Link>
        </div>
        <h2>Lets track your Interview Journey</h2>
        <LineChart labels={interviewLabels} data={interviewScores} />
      </section>
      <section className="flex flex-col w-[25vw] p-4 fixed right-0 justify-between h-[80vh]">
        <h1 className="w-full text-center text-3xl font-semibols">Lets Know your stats!</h1>
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
