export const coverLetterSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        jobRole: { type: "string" },
        jobDescription: { type: "string" },
        company: { type: "string" },
        fieldOfStudy: { type: "string" },
        yearsOfExperience: { type: "string" },
    },
    required: ["name", "jobRole", "jobDescription", "company", "fieldOfStudy", "yearsOfExperience"],
};