"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Radar } from 'react-chartjs-2';
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Register the required components
Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Feedback = ({ params }: { params: Promise<{ id: string }> }) => {
  const [feedback, setFeedback] = useState<any>(null);
  const [interview, setInterview] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const resolvedParams = await params; 
      setId(resolvedParams.id); 

      const interviewData = await getInterviewById(resolvedParams.id);
      if (!interviewData) {
        // Handle redirect or error
        return;
      }
      setInterview(interviewData);

      const feedbackData = await getFeedbackByInterviewId({
        interviewId: resolvedParams.id,
        userId: currentUser?.id!,
      });
      setFeedback(feedbackData);
    };

    fetchData();
  }, [params]);

  if (!feedback || !interview) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  // Prepare data for the radar chart
  const labels = feedback?.categoryScores?.map((category: { name: string; score: number }) => category.name) || [];
  const scores = feedback?.categoryScores?.map((category: { name: string; score: number }) => category.score) || [];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Candidate Scores',
        data: scores,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average Scores',
        data: Array(labels.length).fill(70), // Example average score
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 40, // Set the minimum value to 0
        max: 100, // Set the maximum value to 100
        ticks: {
          stepSize: 10, // Set the step size to 10
          color: 'white', // Color of the ticks
          backdropColor: 'rgba(0, 0, 0, 0.5)', // Background color of the ticks
        },
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.5)', // Color of the angle lines
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Color of the grid lines
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white', // Color of the legend labels
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Background color of the tooltip
        titleColor: 'white', // Color of the tooltip title
        bodyColor: 'white', // Color of the tooltip body
      },
    },
  };

  return (
    <section className="section-feedback py-4">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">

          {/* Date */}
          <div className="flex flex-row items-center gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />
      <div className="flex flex-row space-x-4">
        <div className="flex flex-row gap-2 items-center ">
          <div style={{ width: '50px', height: '50px', marginRight: '30px' }}>
            <CircularProgressbar
              value={feedback?.totalScore}
              maxValue={100}
              text={`${feedback?.totalScore}/100`}
              styles={{
                path: { stroke: `#4bc0c0` },
                text: { fill: '#fff', fontSize: '20px' },
                trail: { stroke: '#d6d6d6' },
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-start space-y-1">
          <h3 className="text-xl font-semibold">Overall Impression</h3>
          <p>{feedback?.finalAssessment}</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="flex flex-col items-start w-full">
        {/* <div className="w-[350px] md:w-1/2">
          <Radar data={data} options={options} />
        </div> */}

        <div className="flex flex-col space-y-8 items-start">
          <div className="hidden lg:flex flex-col gap-3 bg-stone-700 p-4 rounded-lg w-full">
            <h3>Strengths</h3>
            <ul>
              {feedback?.strengths?.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex flex-col gap-3 bg-stone-700 p-4 rounded-lg">
            <h3>Areas for Improvement</h3>
            <ul>
              {feedback?.areasForImprovement?.map((area: string, index: number) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4 -mt-30 md:mt-0">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category: any, index: number) => (
          <div key={index} className="flex items-center my-4 bg-stone-700 p-4 rounded-lg">
            <div style={{ width: '120px', height: '120px', marginRight: '30px' }}>
              <CircularProgressbar
                value={category.score}
                maxValue={100}
                text={`${category.score}/100`}
                styles={{
                  path: { stroke: `#4bc0c0` },
                  text: { fill: '#fff', fontSize: '20px' },
                  trail: { stroke: '#d6d6d6' },
                }}
              />
            </div>
            <div className="flex-grow w-3/5 space-y-3">
              <p className="font-bold">{category.name}</p>
              <hr />
              <p>{category.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex md:hidden flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength: string, index: number) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex md:hidden flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area: string, index: number) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/interview" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/take-interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;