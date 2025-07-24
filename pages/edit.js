import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "next-themes";
import { isAuthenticated } from "../utils/auth";
import Cursor from "../components/Cursor";
import BlogPostManager from "../components/BlogEditor/BlogPostManager";
import FreelanceManager from "../components/FreelanceManager";

const Edit = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated()) {
      window.location.href = "/login";
    }
  }, []);

  // states
  const [data, setData] = useState(null);
  const [currentTabs, setCurrentTabs] = useState("HEADER");
  const { theme } = useTheme();
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const resumeInputRef = useRef();
  const [resumeUploadStatus, setResumeUploadStatus] = useState("");

  // Fetch latest data on mount
  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const saveData = () => {
    setSaveError("");
    setSaveSuccess("");
    fetch("/api/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "DONE") {
          setSaveSuccess("Saved successfully!");
          // Re-fetch latest data
          fetch("/api/portfolio")
            .then((res) => res.json())
            .then(setData);
        } else {
          setSaveError(
            result.error ||
              "Failed to save. Please check your server/API configuration."
          );
        }
      })
      .catch((err) => {
        setSaveError("Network or server error: " + err.message);
      });
  };

  const handleResumeUpload = async (e) => {
    setResumeUploadStatus("");
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setResumeUploadStatus("Only PDF files are allowed.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/resume-upload", {
      method: "POST",
      body: file,
    });
    if (res.ok) {
      setResumeUploadStatus("Resume uploaded successfully!");
    } else {
      setResumeUploadStatus("Failed to upload resume.");
    }
  };

  // Project Handler
  const editProjects = (projectIndex, editProject) => {
    let copyProjects = data.projects;
    copyProjects[projectIndex] = { ...editProject };
    setData({ ...data, projects: copyProjects });
  };

  const addProject = () => {
    setData({
      ...data,
      projects: [
        ...data.projects,
        {
          id: uuidv4(),
          title: "New Project",
          description: "Web Design & Development",
          imageSrc:
            "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTAyfHxwYXN0ZWx8ZW58MHx8MHw%3D&auto=format&fit=crop&w=400&q=60",

          url: "http://chetanverma.com/",
        },
      ],
    });
  };

  const deleteProject = (id) => {
    const copyProjects = data.projects;
    copyProjects = copyProjects.filter((project) => project.id !== id);
    setData({ ...data, projects: copyProjects });
  };

  // Services Handler

  const editServices = (serviceIndex, editService) => {
    let copyServices = data.services;
    copyServices[serviceIndex] = { ...editService };
    setData({ ...data, services: copyServices });
  };

  const addService = () => {
    setData({
      ...data,
      services: [
        ...data.services,
        {
          id: uuidv4(),
          title: "New Service",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        },
      ],
    });
  };

  const deleteService = (id) => {
    const copyServices = data.services;
    copyServices = copyServices.filter((service) => service.id !== id);
    setData({ ...data, services: copyServices });
  };

  // Socials Handler

  const editSocials = (socialIndex, editSocial) => {
    let copySocials = data.socials;
    copySocials[socialIndex] = { ...editSocial };
    setData({ ...data, socials: copySocials });
  };

  const addSocials = () => {
    setData({
      ...data,
      socials: [
        ...data.socials,
        {
          id: uuidv4(),
          title: "New Link",
          link: "www.chetanverma.com",
        },
      ],
    });
  };

  const deleteSocials = (id) => {
    const copySocials = data.socials;
    copySocials = copySocials.filter((social) => social.id !== id);
    setData({ ...data, socials: copySocials });
  };

  // Resume

  const handleAddExperiences = () => {
    setData({
      ...data,
      resume: {
        ...data.resume,
        experiences: [
          ...data.resume.experiences,
          {
            id: uuidv4(),
            dates: "Enter Dates",
            type: "Full Time",
            position: "Frontend Engineer at X",
            bullets: "",
          },
        ],
      },
    });
  };

  const handleEditExperiences = (index, editExperience) => {
    let copyExperiences = [...data.resume.experiences];
    copyExperiences[index] = { ...editExperience, bullets: String(editExperience.bullets ?? "") };
    setData({
      ...data,
      resume: { ...data.resume, experiences: copyExperiences },
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      {saveError && (
        <div style={{ color: "red", margin: 8 }}>{saveError}</div>
      )}
      {saveSuccess && (
        <div style={{ color: "green", margin: 8 }}>{saveSuccess}</div>
      )}
      <div className={`container mx-auto ${data.showCursor && "cursor-none"}`}>
        <Header isBlog data={data} />
        {data.showCursor && <Cursor />}
        <div className="mt-10">
          <div className={`${theme === "dark" ? "bg-transparent" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl">Dashboard</h1>
              <div className="flex items-center">
                <Button onClick={saveData} type="primary">
                  Save
                </Button>
              </div>
            </div>

            <div className="flex items-center">
              <Button
                onClick={() => setCurrentTabs("HEADER")}
                type={currentTabs === "HEADER" && "primary"}
              >
                Header
              </Button>
              <Button
                onClick={() => setCurrentTabs("PROJECTS")}
                type={currentTabs === "PROJECTS" && "primary"}
              >
                Projects
              </Button>
              <Button
                onClick={() => setCurrentTabs("SERVICES")}
                type={currentTabs === "SERVICES" && "primary"}
              >
                Services
              </Button>
              <Button
                onClick={() => setCurrentTabs("ABOUT")}
                type={currentTabs === "ABOUT" && "primary"}
              >
                About
              </Button>
              <Button
                onClick={() => setCurrentTabs("SOCIAL")}
                type={currentTabs === "SOCIAL" && "primary"}
              >
                Social
              </Button>
              <Button
                onClick={() => setCurrentTabs("RESUME")}
                type={currentTabs === "RESUME" && "primary"}
              >
                Resume
              </Button>
              <Button
                onClick={() => setCurrentTabs("BLOGS")}
                type={currentTabs === "BLOGS" && "primary"}
              >
                Blogs
              </Button>
              <Button
                onClick={() => setCurrentTabs("FREELANCE")}
                type={currentTabs === "FREELANCE" && "primary"}
              >
                Freelance
              </Button>
            </div>
          </div>
          {/* HEADER */}
          {currentTabs === "HEADER" && (
            <div className="mt-10">
              <div className="flex items-center">
                <label className="w-1/5 text-lg opacity-50">Name</label>
                <input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-sx opacity-50">
                  Header Tagline One
                </label>
                <input
                  value={data.headerTaglineOne}
                  onChange={(e) =>
                    setData({ ...data, headerTaglineOne: e.target.value })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-lg opacity-50">
                  Header Tagline Two
                </label>
                <input
                  value={data.headerTaglineTwo}
                  onChange={(e) =>
                    setData({ ...data, headerTaglineTwo: e.target.value })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-lg opacity-50">
                  Header Tagline Three
                </label>
                <input
                  value={data.headerTaglineThree}
                  onChange={(e) =>
                    setData({ ...data, headerTaglineThree: e.target.value })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-lg opacity-50">
                  Header Tagline Four
                </label>
                <input
                  value={data.headerTaglineFour}
                  onChange={(e) =>
                    setData({ ...data, headerTaglineFour: e.target.value })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-lg opacity-50">Blog</label>
                <div className="w-4/5 ml-10 flex items-center">
                  <Button
                    onClick={() => setData({ ...data, showBlog: true })}
                    type={data.showBlog && "primary"}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => setData({ ...data, showBlog: false })}
                    classes={
                      !data.showBlog && "bg-red-500 text-white hover:bg-red-600"
                    }
                  >
                    No
                  </Button>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-lg opacity-50">Dark Mode</label>
                <div className="w-4/5 ml-10 flex items-center">
                  <Button
                    onClick={() => setData({ ...data, darkMode: true })}
                    type={data.darkMode && "primary"}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => setData({ ...data, darkMode: false })}
                    classes={
                      !data.darkMode && "bg-red-500 text-white hover:bg-red-600"
                    }
                  >
                    No
                  </Button>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-lg opacity-50">Show Resume</label>
                <div className="w-4/5 ml-10 flex items-center">
                  <Button
                    onClick={() => setData({ ...data, showResume: true })}
                    type={data.showResume && "primary"}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => setData({ ...data, showResume: false })}
                    classes={
                      !data.showResume && "bg-red-500 text-white hover:bg-red-600"
                    }
                  >
                    No
                  </Button>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-lg opacity-50">Custom Cursor</label>
                <div className="w-4/5 ml-10 flex items-center">
                  <Button
                    onClick={() => setData({ ...data, showCursor: true })}
                    type={data.showCursor && "primary"}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => setData({ ...data, showCursor: false })}
                    classes={
                      !data.showCursor && "bg-red-500 text-white hover:bg-red-600"
                    }
                  >
                    No
                  </Button>
                </div>
              </div>
              <div className="mt-10 border-t pt-6">
                <h2 className="text-2xl mb-4">Welcome Card</h2>
                <div className="flex items-center mb-4">
                  <label className="w-1/5 text-lg opacity-50">Title</label>
                  <input
                    value={data.welcomeCard?.title || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        welcomeCard: { ...data.welcomeCard, title: e.target.value },
                      })
                    }
                    className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                    type="text"
                  />
                </div>
                <div className="flex items-center mb-4">
                  <label className="w-1/5 text-lg opacity-50">Message</label>
                  <input
                    value={data.welcomeCard?.message || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        welcomeCard: { ...data.welcomeCard, message: e.target.value },
                      })
                    }
                    className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                    type="text"
                  />
                </div>
              </div>
            </div>
          )}
          {/* PROJECTS */}
          {currentTabs === "PROJECTS" && (
            <>
              <div className="mt-10">
                {data.projects.map((project, index) => (
                  <div className="mt-10" key={project.id}>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl">{project.title}</h1>
                      <Button
                        onClick={() => deleteProject(project.id)}
                        type="primary"
                      >
                        Delete
                      </Button>
                    </div>

                    <div className="flex items-center mt-5">
                      <label className="w-1/5 text-lg opacity-50">Title</label>
                      <input
                        value={project.title}
                        onChange={(e) =>
                          editProjects(index, {
                            ...project,
                            title: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="flex items-center mt-2">
                      <label className="w-1/5 text-lg opacity-50">
                        Description
                      </label>
                      <input
                        value={project.description}
                        onChange={(e) =>
                          editProjects(index, {
                            ...project,
                            description: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="flex items-center mt-2">
                      <label className="w-1/5 text-lg opacity-50">
                        Image Source
                      </label>
                      <input
                        value={project.imageSrc}
                        onChange={(e) =>
                          editProjects(index, {
                            ...project,
                            imageSrc: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="flex items-center mt-2">
                      <label className="w-1/5 text-lg opacity-50">url</label>
                      <input
                        value={project.url}
                        onChange={(e) =>
                          editProjects(index, {
                            ...project,
                            url: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <hr className="my-10"></hr>
                  </div>
                ))}
              </div>

              <div className="my-10">
                <Button onClick={addProject} type="primary">
                  Add Project +
                </Button>
              </div>
            </>
          )}
          {/* SERVICES */}
          {currentTabs === "SERVICES" && (
            <>
              <div className="mt-10">
                {data.services.map((service, index) => (
                  <div key={service.id}>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl">{service.title}</h1>
                      <Button
                        onClick={() => deleteService(service.id)}
                        type="primary"
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="flex items-center mt-5">
                      <label className="w-1/5 text-lg opacity-50">Title</label>
                      <input
                        value={service.title}
                        onChange={(e) =>
                          editServices(index, {
                            ...service,
                            title: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="flex items-center mt-5">
                      <label className="w-1/5 text-lg opacity-50">
                        Description
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) =>
                          editServices(index, {
                            ...service,
                            description: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      ></textarea>
                    </div>
                    <hr className="my-10"></hr>
                  </div>
                ))}
              </div>
              <div className="my-10">
                <Button onClick={addService} type="primary">
                  Add Service +
                </Button>
              </div>
            </>
          )}
          {currentTabs === "ABOUT" && (
            <div className="mt-10">
              <h1 className="text-2xl">About</h1>
              <textarea
                className="w-full h-96 mt-10 p-2 rounded-md shadow-md border"
                value={data.aboutpara}
                onChange={(e) => setData({ ...data, aboutpara: e.target.value })}
              ></textarea>
            </div>
          )}
          {currentTabs === "SOCIAL" && (
            <div className="mt-10">
              {data.socials.map((social, index) => (
                <>
                  <div key={social.id}>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl">{social.title}</h1>
                      <Button
                        onClick={() => deleteSocials(social.id)}
                        type="primary"
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="flex items-center mt-5">
                      <label className="w-1/5 text-lg opacity-50">Title</label>
                      <input
                        value={social.title}
                        onChange={(e) =>
                          editSocials(index, {
                            ...social,
                            title: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="flex items-center mt-5">
                      <label className="w-1/5 text-lg opacity-50">Link</label>
                      <input
                        value={social.link}
                        onChange={(e) =>
                          editSocials(index, {
                            ...social,
                            link: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      />
                    </div>
                    <hr className="my-10"></hr>
                  </div>
                </>
              ))}
              <div className="my-10">
                <Button onClick={addSocials} type="primary">
                  Add Social +
                </Button>
              </div>
            </div>
          )}
          {currentTabs === "RESUME" && (
            <div className="mt-10">
              <h1>Main</h1>
              <div className="mt-5 flex items-center">
                <label className="w-1/5 text-sx opacity-50">Tagline</label>
                <input
                  value={data.resume.tagline}
                  onChange={(e) =>
                    setData({
                      ...data,
                      resume: { ...data.resume, tagline: e.target.value },
                    })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="flex items-center mt-5">
                <label className="w-1/5 text-lg opacity-50">Description</label>
                <textarea
                  value={data.resume.description}
                  onChange={(e) =>
                    setData({
                      ...data,
                      resume: { ...data.resume, description: e.target.value },
                    })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                ></textarea>
              </div>
              <hr className="my-10"></hr>

              <h1>Experiences</h1>
              <div className="mt-10">
                {data.resume.experiences.map((experiences, index) => (
                  <div className="mt-5" key={experiences.id}>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl">{experiences.position}</h1>
                      <Button
                        onClick={async () => {
                          const copyExperiences = data.resume.experiences.filter((_, i) => i !== index);
                          const newData = { ...data, resume: { ...data.resume, experiences: copyExperiences } };
                          setData(newData);
                          await fetch("/api/portfolio", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(newData),
                          });
                          // Optionally, re-fetch data to ensure UI is up to date
                          fetch("/api/portfolio").then(res => res.json()).then(setData);
                        }}
                        type="primary"
                      >
                        Delete
                      </Button>
                    </div>

                    <div className="flex items-center mt-5">
                      <label className="w-1/5 text-lg opacity-50">Dates</label>
                      <input
                        value={experiences.dates}
                        onChange={(e) =>
                          handleEditExperiences(index, {
                            ...experiences,
                            dates: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="flex items-center mt-2">
                      <label className="w-1/5 text-lg opacity-50">Type</label>
                      <input
                        value={experiences.type}
                        onChange={(e) =>
                          handleEditExperiences(index, {
                            ...experiences,
                            type: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="flex items-center mt-2">
                      <label className="w-1/5 text-lg opacity-50">Position</label>
                      <input
                        value={experiences.position}
                        onChange={(e) =>
                          handleEditExperiences(index, {
                            ...experiences,
                            position: e.target.value,
                          })
                        }
                        className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                    <div className="mt-2 flex">
                      <label className="w-1/5 text-lg opacity-50">Bullets</label>
                      <div className="w-4/5 ml-10 flex flex-col">
                        <input
                          value={experiences.bullets}
                          onChange={(e) =>
                            handleEditExperiences(index, {
                              ...experiences,
                              bullets: e.target.value,
                            })
                          }
                          placeholder="Bullet One, Bullet Two, Bullet Three"
                          className="p-2 rounded-md shadow-lg border-2"
                          type="text"
                        ></input>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="my-10">
                <Button onClick={handleAddExperiences} type="primary">
                  Add Experience +
                </Button>
              </div>
              <hr className="my-10"></hr>
              <div className="mt-10">
                <h1>Education</h1>
                {Array.isArray(data.resume.education) && data.resume.education.length > 0 ? (
                  data.resume.education.map((edu, idx) => (
                    <div key={edu.id || idx} className="border p-4 rounded mb-4 relative">
                      <button
                        className="absolute top-2 right-2 text-red-500"
                        onClick={() => {
                          const newEdu = data.resume.education.filter((_, i) => i !== idx);
                          setData({
                            ...data,
                            resume: { ...data.resume, education: newEdu },
                          });
                        }}
                      >
                        Delete
                      </button>
                      <div className="flex items-center mt-2">
                        <label className="w-1/5 text-lg opacity-50">Name</label>
                        <input
                          value={edu.universityName}
                          onChange={e => {
                            const newEdu = [...data.resume.education];
                            newEdu[idx].universityName = e.target.value;
                            setData({
                              ...data,
                              resume: { ...data.resume, education: newEdu },
                            });
                          }}
                          className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                          type="text"
                        />
                      </div>
                      <div className="flex items-center mt-2">
                        <label className="w-1/5 text-lg opacity-50">Dates</label>
                        <input
                          value={edu.universityDate}
                          onChange={e => {
                            const newEdu = [...data.resume.education];
                            newEdu[idx].universityDate = e.target.value;
                            setData({
                              ...data,
                              resume: { ...data.resume, education: newEdu },
                            });
                          }}
                          className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                          type="text"
                        />
                      </div>
                      <div className="flex items-center mt-2">
                        <label className="w-1/5 text-lg opacity-50">Detail</label>
                        <input
                          value={edu.universityPara}
                          onChange={e => {
                            const newEdu = [...data.resume.education];
                            newEdu[idx].universityPara = e.target.value;
                            setData({
                              ...data,
                              resume: { ...data.resume, education: newEdu },
                            });
                          }}
                          className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                          type="text"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mt-2 text-sm opacity-50">No education entries.</div>
                )}
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    const newEdu = [
                      ...data.resume.education,
                      {
                        id: Date.now().toString(),
                        universityName: "",
                        universityDate: "",
                        universityPara: "",
                      },
                    ];
                    setData({
                      ...data,
                      resume: { ...data.resume, education: newEdu },
                    });
                  }}
                >
                  Add Education
                </button>
              </div>
              <div className="mt-4">
                <label className="block mb-2 font-bold">Upload Resume (PDF):</label>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  className="mb-2"
                />
                {resumeUploadStatus && <div className="text-sm mt-1">{resumeUploadStatus}</div>}
                <Button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete the resume PDF?")) {
                      const res = await fetch("/api/resume-upload", { method: "DELETE" });
                      if (res.ok) {
                        setResumeUploadStatus("Resume deleted successfully!");
                      } else {
                        setResumeUploadStatus("Failed to delete resume.");
                      }
                    }
                  }}
                  type="primary"
                  classes="ml-4"
                >
                  Delete Resume PDF
                </Button>
              </div>
            </div>
          )}
          {/* BLOGS */}
          {currentTabs === "BLOGS" && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Edit Blog Posts</h2>
              <BlogPostManager />
            </div>
          )}
          {/* FREELANCE */}
          {currentTabs === "FREELANCE" && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Edit Freelance Gigs</h2>
              <FreelanceManager
                freelance={data.freelance}
                setFreelance={freelance => setData({ ...data, freelance })}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Edit;
