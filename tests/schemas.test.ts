import { describe, it, expect } from "vitest";
import {
    assessmentSchema,
    noteSchema,
    syllabusSchema,
    topicRequest,
} from "@/lib/validation/schemas";
describe("AI contracts", () => {
    it("rejects an empty topic", () =>
        expect(() =>
            topicRequest.parse({ subject: "OS", topic: "" }),
        ).toThrow());
    it("accepts structured syllabus output", () =>
        expect(
            syllabusSchema.parse({
                subject: "OS",
                units: [
                    {
                        name: "Unit 1",
                        topics: [{ name: "Processes", subtopics: [] }],
                    },
                ],
            }).subject,
        ).toBe("OS"));
    it("requires assessment explanations", () =>
        expect(() =>
            assessmentSchema.parse({ title: "x", questions: [] }),
        ).toThrow());
    it("requires meaningful notes sections", () =>
        expect(() => noteSchema.parse({ title: "x", sections: [] })).toThrow());
});
