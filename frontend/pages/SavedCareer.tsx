import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  PlayCircle,
  Loader2,
  Briefcase,
  Target,
  Activity,
  Bookmark,
  Video,
  FileText,
  GraduationCap,
  Award,
  Download,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { RoadmapStep, Resource } from "../types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const SavedCareer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, toggleResourceCompletion } = useApp();

  const [careerData, setCareerData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSavedCareers();
  }, []);

  const getSavedCareers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/career/my-saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCareerData(data.data || []);
    } catch (error) {
      console.error("Failed to fetch careers", error);
    } finally {
      setLoading(false);
    }
  };

  const activeCareer = useMemo(() => {
    if (!careerData) return null;
    return careerData.find((c) => String(c._id) === id || String(c.id) === id);
  }, [careerData, id]);

  const handleSaveToggle = async () => {
    if (!isSaved) {
      saveCareer();
    } else {
      removeSavedCareer();
    }
  };

  const saveCareer = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:8000/api/career/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activeCareer),
      });
      setIsSaved(!isSaved);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const removeSavedCareer = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/api/career/remove/${activeCareer._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsSaved(false);
        // Refresh the local list so the UI updates
        getSavedCareers();
      }
    } catch (e) {
      console.error("Removal failed", e);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !activeCareer) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains("dark")
          ? "#0f172a"
          : "#ffffff",
        ignoreElements: (el) => el.id === "pdf-ignore",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${activeCareer.title.replace(/\s+/g, "_")}_Plan.pdf`);
    } catch (error) {
      alert("PDF generation failed.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <Video size={16} />;
      case "article":
        return <FileText size={16} />;
      case "course":
        return <GraduationCap size={16} />;
      default:
        return <ExternalLink size={16} />;
    }
  };

  const getResourceStyles = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:text-red-300";
      case "article":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/10 dark:text-blue-300";
      case "course":
        return "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/10 dark:text-purple-300";
      default:
        return "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const acquiredSkills = useMemo(
    () =>
      activeCareer?.requiredSkills?.filter((s: string) =>
        userProfile.mySkills.some((us) => us.toLowerCase() === s.toLowerCase())
      ) || [],
    [activeCareer, userProfile.mySkills]
  );

  const missingSkills = useMemo(
    () =>
      activeCareer?.requiredSkills?.filter(
        (s: string) =>
          !userProfile.mySkills.some(
            (us) => us.toLowerCase() === s.toLowerCase()
          )
      ) || [],
    [activeCareer, userProfile.mySkills]
  );

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <Loader2 className='animate-spin text-brand-600 mb-4' size={48} />
        <p className='text-slate-500'>Loading your career path...</p>
      </div>
    );

  if (!activeCareer)
    return <div className='text-center py-20'>Career path not found.</div>;

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center text-slate-500 hover:text-brand-600 mb-6 group transition-colors'
      >
        <ArrowLeft
          size={18}
          className='mr-1 group-hover:-translate-x-1 transition-transform'
        />{" "}
        Back
      </button>

      <div ref={contentRef}>
        {/* Hero Section */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-8 mb-8 relative overflow-hidden transition-colors'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-brand-50 dark:bg-brand-900/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none'></div>
          <div className='relative z-10'>
            <div className='flex flex-col md:flex-row justify-between gap-4'>
              <div className='w-full'>
                <div className='flex flex-wrap items-center justify-between gap-4 mb-3'>
                  <h1 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-white'>
                    {activeCareer.title}
                  </h1>
                  <div id='pdf-ignore' className='flex items-center gap-3'>
                    <button
                      onClick={handleSaveToggle}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium ${
                        isSaved
                          ? "bg-brand-50 border-brand-200 text-brand-700"
                          : "bg-white dark:bg-slate-800 text-slate-600"
                      }`}
                    >
                      <Bookmark
                        size={18}
                        className={isSaved ? "fill-current" : ""}
                      />{" "}
                      {isSaved ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPdf}
                      className='flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-50'
                    >
                      {isGeneratingPdf ? (
                        <Loader2 size={16} className='animate-spin' />
                      ) : (
                        <Download size={16} />
                      )}{" "}
                      Download PDF
                    </button>
                  </div>
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                  <div className='flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1.5 rounded-full shadow-lg text-sm font-bold'>
                    ₹{" "}
                    {activeCareer.salaryRange?.replace("₹", "") ||
                      "Competitive"}
                  </div>
                  {activeCareer.matchPercentage && (
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold border ${
                        activeCareer.matchPercentage > 80
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-yellow-50 border-yellow-200 text-yellow-700"
                      }`}
                    >
                      {activeCareer.matchPercentage}% Match
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Role Overview */}
            {activeCareer.roleOverview?.length > 0 ? (
              <div className='mt-8'>
                <h3 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center'>
                  <Briefcase size={14} className='mr-2' />A Typical Day
                </h3>
                <div className='grid md:grid-cols-3 gap-4'>
                  {activeCareer.roleOverview.map((point: string, i: number) => (
                    <div
                      key={i}
                      className='bg-slate-50 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all'
                    >
                      <div className='w-8 h-8 rounded-full bg-white dark:bg-slate-700 text-brand-600 flex items-center justify-center font-bold text-sm'>
                        {i + 1}
                      </div>
                      <p className='text-slate-700 dark:text-slate-300 text-sm leading-relaxed'>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-slate-500 mt-4'>{activeCareer.description}</p>
            )}
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            {/* Skill Inventory */}
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-200 p-5'>
                <h3 className='text-green-800 dark:text-green-400 font-bold mb-3 flex items-center'>
                  <CheckCircle size={18} className='mr-2' /> Your Foundation
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {acquiredSkills.length > 0 ? (
                    acquiredSkills.map((s: string) => (
                      <span
                        key={s}
                        className='bg-white dark:bg-slate-800 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-sm'
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className='text-sm italic'>No direct matches.</span>
                  )}
                </div>
              </div>
              <div className='bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-200 p-5'>
                <h3 className='text-orange-800 dark:text-orange-400 font-bold mb-3 flex items-center'>
                  <Target size={18} className='mr-2' /> Skills to Build
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {missingSkills.length > 0 ? (
                    missingSkills.map((s: string) => (
                      <span
                        key={s}
                        className='bg-white dark:bg-slate-800 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-md text-sm'
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className='text-sm italic'>
                      Skills fully matched!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Readiness Meter */}
            <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 p-6 shadow-sm'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-bold text-lg flex items-center'>
                  <Activity className='mr-2 text-brand-600' size={20} />{" "}
                  Readiness
                </h3>
                <span className='text-3xl font-extrabold text-brand-600'>
                  {activeCareer.matchPercentage}%
                </span>
              </div>
              <div className='relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-orange-400 to-green-500 transition-all duration-1000'
                  style={{ width: `${activeCareer.matchPercentage}%` }}
                />
              </div>
            </div>

            {/* Roadmap */}
            <div>
              <h2 className='text-2xl font-bold mb-6 flex items-center'>
                <BookOpen className='mr-3 text-brand-600' size={24} />{" "}
                {missingSkills.length === 0
                  ? "Ready to Apply"
                  : "Your Bridge Plan"}
              </h2>
              <div className='relative border-l-2 border-slate-200 ml-4 space-y-8'>
                {activeCareer.roadmap?.map((step: RoadmapStep, idx: number) => (
                  <div key={idx} className='pl-8 relative group'>
                    <div className='absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white border-2 border-brand-500 transition-colors shadow-sm'></div>
                    <div className='bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow'>
                      <div className='flex justify-between items-start mb-2'>
                        <h3 className='text-lg font-bold text-slate-800 dark:text-slate-200'>
                          {step.title}
                        </h3>
                        <span className='text-xs bg-brand-50 text-brand-700 font-medium px-2.5 py-1 rounded-full border border-brand-100 flex items-center'>
                          <Clock size={12} className='mr-1' /> {step.duration}
                        </span>
                      </div>
                      <p className='text-slate-600 dark:text-slate-400'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Resources */}
          <div className='space-y-6'>
            <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-md overflow-hidden sticky top-24'>
              <div className='bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200'>
                <h3 className='font-bold flex items-center'>
                  <PlayCircle className='mr-2 text-brand-600' size={20} />{" "}
                  Targeted Resources
                </h3>
              </div>
              <div className='p-4 space-y-3'>
                {activeCareer.resources?.map((res: Resource, idx: number) => {
                  const isCompleted = userProfile.completedResources.includes(
                    res.url
                  );
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border transition-all ${
                        isCompleted
                          ? "opacity-75 bg-emerald-50 border-emerald-200"
                          : getResourceStyles(res.type)
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <span className='text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 bg-white/50'>
                          {getResourceIcon(res.type)} {res.type}
                        </span>
                        <button
                          id='pdf-ignore'
                          onClick={() => toggleResourceCompletion(res.url)}
                          className={`p-1 rounded-full hover:bg-black/5 ${
                            isCompleted ? "text-green-600" : "text-slate-400"
                          }`}
                        >
                          <CheckCircle
                            size={18}
                            className={isCompleted ? "fill-current" : ""}
                          />
                        </button>
                      </div>
                      <h4
                        className={`font-semibold text-sm mt-2 mb-1 ${
                          isCompleted ? "line-through" : ""
                        }`}
                      >
                        {res.title}
                      </h4>
                      <div className='flex items-center justify-between mt-2 pt-2 border-t border-black/5'>
                        <span className='text-xs font-medium'>
                          {res.duration}
                        </span>
                        <a
                          href={res.url}
                          target='_blank'
                          rel='noreferrer'
                          className='flex items-center text-xs font-bold'
                        >
                          Open <ExternalLink size={10} className='ml-1' />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
