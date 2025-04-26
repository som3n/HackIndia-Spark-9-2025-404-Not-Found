import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
        interviewId,
        userId,
      })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-90 transition-transform transform hover:shadow-lg pb-1">
      <div className="bg-gradient-to-b from-[#1E201E] to-[#181C14] p-5 bg-white rounded-xl shadow-md flex flex-col items-start justify-between h-full">
        <div className="space-y-5">
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg rounded-tr-xl",
              badgeColor
            )}
          >
            <p className="badge-text font-semibold text-white">{normalizedType}</p>
          </div>

          {/* Cover Image and Interview Role */}
          <div className="flex flex-col items-center mt-5">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={90}
              height={90}
              className="rounded-full object-fit size-[60px] border-2 border-gray-300 shadow-sm"
            />
            <h3 className="ml-4 capitalize text-xl font-bold text-center mt-4">{role} Interview</h3>
          </div>

          {/* Date & Score */}
          <div className="flex flex-col items-center">
            <div className="flex flex-row gap-5 mt-3">
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src="/calendar.svg"
                  width={22}
                  height={22}
                  alt="calendar"
                />
                <p className="text-gray-600">{formattedDate}</p>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" width={22} height={22} alt="star" />
                <p className="text-gray-600">{feedback?.totalScore || "---"}/100</p>
              </div>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5 text-white text-center">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-col space-y-2 items-center justify-between mt-4 w-full">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200">
            <Link
              href={
                feedback
                  ? `/take-interview/${interviewId}/feedback`
                  : `/take-interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
