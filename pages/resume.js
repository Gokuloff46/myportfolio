import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import ProjectResume from "../components/ProjectResume";
import Socials from "../components/Socials";
import Button from "../components/Button";
import { useTheme } from "next-themes";

const Resume = ({ data }) => {
  const router = useRouter();
  const theme = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
    if (!data || !data.showResume || !data.resume) {
      router.push("/");
    }
  }, [router, data]);

  if (!data || !data.resume) {
    return <div className="text-center mt-20 text-xl">Resume data not found.</div>;
  }

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => router.push("/edit")} type={"primary"}>
            Edit Resume
          </Button>
        </div>
      )}
      {data.showCursor && <Cursor />}
      <div
        className={`container mx-auto mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog data={data} />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            {/* Resume Download Button */}
            <a
              href="/resume.pdf"
              download
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download Resume
            </a>
            <div
              className={`w-full ${
                mount && theme.theme === "dark" ? "bg-slate-800" : "bg-gray-50"
              } max-w-4xl p-20 mob:p-5 desktop:p-20 rounded-lg shadow-sm`}
            >
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <h2 className="text-xl mt-5">{data.resume.tagline}</h2>
              <h2 className="w-4/5 text-xl mt-5 opacity-50">
                {data.resume.description}
              </h2>
              <div className="mt-2">
                <Socials />
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Experience</h1>

                {data.resume.experiences &&
                  data.resume.experiences.map(
                    ({ id, dates, type, position, bullets }) => (
                      <ProjectResume
                        key={id}
                        dates={dates}
                        type={type}
                        position={position}
                        bullets={bullets}
                      ></ProjectResume>
                    )
                  )}
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Education</h1>
                {Array.isArray(data.resume.education) &&
                data.resume.education.length > 0 ? (
                  data.resume.education.map((edu, idx) => (
                    <div className="mt-2" key={edu.id || idx}>
                      <h2 className="text-lg">{edu.universityName}</h2>
                      <h3 className="text-sm opacity-75">{edu.universityDate}</h3>
                      <p className="text-sm mt-2 opacity-50">{edu.universityPara}</p>
                    </div>
                  ))
                ) : (
                  <div className="mt-2 text-sm opacity-50">No education entries.</div>
                )}
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Skills</h1>
                <div className="flex mob:flex-col desktop:flex-row justify-between">
                  {data.resume.languages && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Languages</h2>
                      <ul className="list-disc">
                        {data.resume.languages.map((language, index) => (
                          <li key={index} className="ml-5 py-2">
                            {language}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.resume.frameworks && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Tools & Technologies</h2>
                      <ul className="list-disc">
                        {data.resume.frameworks.map((framework, index) => (
                          <li key={index} className="ml-5 py-2">
                            {framework}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.resume.others && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">cloud Service and others </h2>
                      <ul className="list-disc">
                        {data.resume.others.map((other, index) => (
                          <li key={index} className="ml-5 py-2">
                            {other}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(process.cwd(), "data/portfolio.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(fileContents);
  return { props: { data } };
}

export default Resume;
