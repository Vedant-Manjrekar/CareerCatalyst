import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
  DollarSign,
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
import { getDetailedCareerPlan } from "../services/geminiService";
import { CareerPath, RoadmapStep, Resource } from "../types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const CareerDetails: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userProfile,
    toggleResourceCompletion,
    saveCareer,
    removeCareer,
    globalResources,
    saveResource,
    removeResource,
  } = useApp();

  const initialCareer =
    location.state?.career || userProfile.savedCareers.find((c) => c.id === id);

  const [career, setCareer] = useState<CareerPath | null>(
    initialCareer || null
  );
  const [loading, setLoading] = useState(!initialCareer?.roadmap);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaved, setIsSaved] = useState(
    userProfile.savedCareers.some((c) => c.id === id)
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const [validationStatuses, setValidationStatuses] = useState<Record<string, 'valid' | 'invalid' | 'checking'>>({});

  useEffect(() => {
    if (!career) {
      navigate("/finder");
      return;
    }

    const validateLinks = async (urls: string[]) => {
      urls.forEach(async (url) => {
        setValidationStatuses(prev => ({ ...prev, [url]: 'checking' }));
        try {
          const res = await fetch("http://localhost:8000/api/resources/validate-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
          });
          const data = await res.json();
          setValidationStatuses(prev => ({ 
            ...prev, 
            [url]: data.isValid ? 'valid' : 'invalid' 
          }));
        } catch {
          setValidationStatuses(prev => ({ ...prev, [url]: 'invalid' }));
        }
      });
    };

    const fetchDetails = async () => {
      try {
        const details = await getDetailedCareerPlan(
          career.title,
          userProfile.mySkills
        );
        
        // --- HYBRID RESOURCE BLENDING ---
        let blendedResources = details.resources || [];
        
        if (details.roadmap && details.roadmap.length > 0 && globalResources.length > 0) {
          const missing = details.roadmap.map(s => s.title.toLowerCase());
          const vetted = globalResources.filter((gr: any) => 
            gr.tags?.some((t: string) => missing.some(m => m.includes(t.toLowerCase()))) ||
            missing.some(m => gr.title.toLowerCase().includes(m))
          );

          blendedResources = [...vetted, ...(details.resources || [])].filter(
            (v, i, a) => a.findIndex(t => t.url === v.url) === i
          );
        }

        setCareer((prev) => (prev ? { ...prev, ...details, resources: blendedResources } : null));
        if (blendedResources.length > 0) {
          validateLinks(blendedResources.map(r => r.url));
        }
      } catch (err) {
        console.error("Failed to fetch details", err);
      } finally {
        setLoading(false);
      }
    };

    if (!career.roadmap || !career.roleOverview) {
      fetchDetails();
    } else {
      setLoading(false);
      validateLinks(career.resources.map(r => r.url));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveToggle = async () => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8000/api/career/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(career),
    });

    setIsSaved(!isSaved);
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !career) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains("dark")
          ? "#0f172a"
          : "#ffffff",
        ignoreElements: (element) => element.id === "pdf-ignore",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${career.title.replace(/\s+/g, "_")}_Career_Plan.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
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
    switch (type.toLowerCase()) {
      case "video":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-300 hover:border-red-300 dark:hover:border-red-800";
      case "article":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-300 hover:border-blue-300 dark:hover:border-blue-800";
      case "course":
        return "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/10 dark:border-purple-900/30 dark:text-purple-300 hover:border-purple-300 dark:hover:border-purple-800";
      default:
        return "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";
    }
  };

  if (loading || !career) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center'>
        <Loader2 size={48} className='animate-spin text-brand-600 mb-6' />
        <h2 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
          Designing Your Custom Plan
        </h2>
        <p className='text-slate-500 dark:text-slate-400 mt-2'>
          Analyzing your skills and building a bridge to your new career...
        </p>
      </div>
    );
  }

  const acquiredSkills = career.requiredSkills.filter((s) =>
    userProfile.mySkills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  const missingSkills = career.requiredSkills.filter(
    (s) =>
      !userProfile.mySkills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  const isFullyQualified = missingSkills.length === 0;

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 mb-6 transition-colors group'
      >
        <ArrowLeft
          size={18}
          className='mr-1 group-hover:-translate-x-1 transition-transform'
        />{" "}
        Back
      </button>

      {/* Main Report Container for PDF Capture */}
      <div ref={contentRef} className='bg-transparent'>
        {/* Hero Header */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl shadow-md dark:shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-8 relative overflow-hidden transition-colors duration-300'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-brand-50 dark:bg-brand-900/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none'></div>
          <div className='relative z-10'>
            <div className='flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4'>
              <div className='w-full'>
                <div className='flex flex-wrap items-center justify-between gap-4 mb-3'>
                  <h1 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-white'>
                    {career.title}
                  </h1>

                  <div id='pdf-ignore' className='flex items-center gap-3'>
                    <button
                      onClick={handleSaveToggle}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all font-medium text-sm ${
                        isSaved
                          ? "bg-brand-50 border-brand-200 text-brand-700 dark:bg-moon-900/30 dark:border-moon-800 dark:text-moon-300"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                      title={isSaved ? "Remove from Saved" : "Save Career Path"}
                    >
                      <Bookmark
                        size={18}
                        className={isSaved ? "fill-current" : ""}
                      />
                      {isSaved ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPdf}
                      className='flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all font-medium text-sm shadow-sm disabled:opacity-70 disabled:cursor-not-allowed'
                    >
                      {isGeneratingPdf ? (
                        <Loader2 size={16} className='animate-spin' />
                      ) : (
                        <Download size={16} />
                      )}
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-4 mt-2'>
                  {/* Pop Salary Badge */}
                  <div className='flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 text-sm font-bold'>
                    {career.salaryRange
                      ? (() => {
                          // Extract clean salary range (e.g., "₹8L - ₹15L PA" from verbose text)
                          const match = career.salaryRange.match(/₹[\d.]+[LKlk]?\s*-\s*₹[\d.]+[LKlk]?(\s*PA)?/i);
                          return match ? match[0] : career.salaryRange.substring(0, 25);
                        })()
                      : "Competitive"}
                  </div>

                  {career.matchPercentage && (
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold border ${
                        career.matchPercentage > 80
                          ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
                          : "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400"
                      }`}
                    >
                      {career.matchPercentage}% Match
                    </span>
                  )}
                </div>
              </div>
            </div>

            {career.roleOverview &&
            Array.isArray(career.roleOverview) &&
            career.roleOverview.length > 0 ? (
              <div className='mt-8'>
                <h3 className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center'>
                  <Briefcase size={14} className='mr-2' />A Typical Day
                </h3>
                <div className='grid md:grid-cols-3 gap-4'>
                  {career.roleOverview.map((point, i) => (
                    <div
                      key={i}
                      className='bg-slate-50 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all'
                    >
                      <div className='w-8 h-8 rounded-full bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-sm shadow-sm'>
                        {i + 1}
                      </div>
                      <p className='text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed'>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-slate-500 dark:text-slate-400 max-w-2xl mt-4'>
                {career.description}
              </p>
            )}
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column: Skills Analysis & Roadmap */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Skill Inventory Section */}
            <div className='grid md:grid-cols-2 gap-4'>
              {/* Your Foundation */}
              <div className='bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30 p-5 shadow-sm'>
                <h3 className='text-green-800 dark:text-green-400 font-bold mb-3 flex items-center'>
                  <CheckCircle size={18} className='mr-2' /> Your Foundation
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {acquiredSkills.length > 0 ? (
                    acquiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className='bg-white dark:bg-slate-800 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-2.5 py-1 rounded-md text-sm shadow-sm flex items-center'
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className='text-sm text-green-600 dark:text-green-500 italic'>
                      No direct matches found yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Skills to Build */}
              <div className='bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-900/30 p-5 shadow-sm'>
                <h3 className='text-orange-800 dark:text-orange-400 font-bold mb-3 flex items-center'>
                  <Target size={18} className='mr-2' /> Skills to Build
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {missingSkills.length > 0 ? (
                    missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className='bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 px-2.5 py-1 rounded-md text-sm shadow-sm'
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className='text-sm text-orange-600 dark:text-orange-500 italic'>
                      You have all required skills!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Skill Level Meter */}
            <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='font-bold text-slate-900 dark:text-white text-lg flex items-center'>
                    <Activity
                      className='mr-2 text-brand-600 dark:text-brand-400'
                      size={20}
                    />
                    Skill Readiness Level
                  </h3>
                  <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>
                    Based on your current skill set match
                  </p>
                </div>
                <div className='text-right'>
                  <span className='text-3xl font-extrabold text-brand-600 dark:text-moon-400'>
                    {career.matchPercentage}%
                  </span>
                </div>
              </div>

              <div className='relative pt-2 pb-6 px-1'>
                <div className='relative h-4 mt-2'>
                  {/* Track */}
                  <div className='absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
                    {/* Fill */}
                    <div
                      className='h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-green-500 transition-all duration-1000 ease-out'
                      style={{ width: `${career.matchPercentage}%` }}
                    />
                  </div>

                  {/* Knob */}
                  <div
                    className='absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-slate-700 border-4 border-brand-500 dark:border-moon-500 rounded-full shadow-md transition-all duration-1000 ease-out z-10'
                    style={{ left: `calc(${career.matchPercentage}% - 10px)` }}
                  />
                </div>

                {/* Ticks/Labels */}
                <div className='flex justify-between mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider'>
                  <span className='w-1/3 text-left'>Beginner</span>
                  <span className='w-1/3 text-center'>Intermediate</span>
                  <span className='w-1/3 text-right'>Pro</span>
                </div>
              </div>
            </div>

            {/* Adaptive Roadmap */}
            <div>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white flex items-center mb-6'>
                <BookOpen
                  className='mr-3 text-brand-600 dark:text-brand-400'
                  size={24}
                />
                {isFullyQualified ? "Ready to Apply" : "Your Bridge Plan"}
              </h2>

              {isFullyQualified ? (
                <div className='bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-moon-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border border-brand-100 dark:border-white/10 text-center'>
                  <div className='w-16 h-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-moon-300 shadow-md'>
                    <Award size={32} />
                  </div>
                  <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
                    You are a perfect match!
                  </h3>
                  <p className='text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-6'>
                    Your skills align perfectly with the requirements for this
                    role. You don't need a learning roadmap—you need to start
                    applying!
                  </p>
                  <button className='px-6 py-3 bg-brand-600 dark:bg-moon-600 text-white rounded-lg font-bold shadow-lg hover:bg-brand-700 dark:hover:bg-moon-500 transition-colors'>
                    Search Open Roles
                  </button>
                </div>
              ) : (
                <>
                  <p className='text-slate-500 dark:text-slate-400 mb-8 -mt-4'>
                    Step-by-step guide to bridging your {missingSkills.length}{" "}
                    missing skills.
                  </p>
                  <div className='relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4'>
                    {career.roadmap?.map((step: RoadmapStep, index: number) => (
                      <div key={index} className='pl-8 relative group'>
                        <div className='absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-brand-500 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors shadow-sm'></div>
                        <div className='bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow'>
                          <div className='flex justify-between items-start mb-2'>
                            <h3 className='text-lg font-bold text-slate-800 dark:text-slate-200'>
                              {step.title}
                            </h3>
                            <span className='text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-medium px-2.5 py-1 rounded-full border border-brand-100 dark:border-brand-900/30 whitespace-nowrap ml-2 flex items-center'>
                              <Clock size={12} className='mr-1' />{" "}
                              {step.duration}
                            </span>
                          </div>
                          <p className='text-slate-600 dark:text-slate-400'>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!career.roadmap || career.roadmap.length === 0) && (
                      <div className='pl-8 text-slate-500 dark:text-slate-500 italic'>
                        No roadmap steps generated yet.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Resources & Insights */}
          <div className='space-y-6'>
            {/* Targeted Resources */}
            <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-sm overflow-hidden sticky top-24 transition-colors duration-300'>
              <div className='bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700'>
                <h3 className='font-bold text-slate-800 dark:text-slate-200 flex items-center'>
                  <PlayCircle
                    className='mr-2 text-brand-600 dark:text-brand-400'
                    size={20}
                  />
                  Targeted Resources
                </h3>
              </div>
              <div className='p-4 space-y-3'>
                {!career.resources || career.resources.length === 0 ? (
                  <div className='text-center py-8 text-slate-500 dark:text-slate-400'>
                    <PlayCircle size={32} className='mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>No resources available yet. They'll appear once the roadmap is generated.</p>
                  </div>
                ) : [...career.resources]
                  .sort((a, b) => {
                    // Sort: valid/checking first, invalid last
                    const statusA = validationStatuses[a.url] || 'checking';
                    const statusB = validationStatuses[b.url] || 'checking';
                    if (statusA === 'invalid' && statusB !== 'invalid') return 1;
                    if (statusA !== 'invalid' && statusB === 'invalid') return -1;
                    return 0;
                  })
                  .map((res: Resource, idx: number) => {
                  const isCompleted = userProfile.completedResources.includes(
                    res.url
                  );
                  const styleClasses = getResourceStyles(res.type);

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border transition-all group ${
                        isCompleted
                          ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30 opacity-75"
                          : styleClasses
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 bg-white/50 dark:bg-black/20`}
                        >
                          {getResourceIcon(res.type)}
                          {res.type}
                        </span>
                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => {
                              const isSaved = userProfile.savedResources?.some(r => r.url === res.url);
                              if (isSaved) {
                                removeResource(res.url);
                              } else {
                                saveResource(res);
                              }
                            }}
                            className={`transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${
                              userProfile.savedResources?.some(r => r.url === res.url)
                                ? "text-brand-600 dark:text-brand-400"
                                : "text-slate-400 hover:text-brand-500"
                            }`}
                            title={
                              userProfile.savedResources?.some(r => r.url === res.url)
                                ? "Remove from saved"
                                : "Save resource"
                            }
                            id='pdf-ignore'
                          >
                            <Bookmark
                              size={18}
                              className={userProfile.savedResources?.some(r => r.url === res.url) ? "fill-current" : ""}
                            />
                          </button>
                          <button
                            onClick={() => toggleResourceCompletion(res.url)}
                            className={`transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${
                              isCompleted
                                ? "text-green-600 dark:text-green-400"
                                : "text-slate-400 hover:text-green-500"
                            }`}
                            title={
                              isCompleted
                                ? "Mark as incomplete"
                                : "Mark as complete"
                            }
                            id='pdf-ignore'
                          >
                            <CheckCircle
                              size={18}
                              className={isCompleted ? "fill-current" : ""}
                            />
                          </button>
                        </div>
                      </div>
                      <h4
                        className={`font-semibold text-sm mt-2 mb-1 line-clamp-2 ${
                          isCompleted
                            ? "text-slate-600 dark:text-slate-400 line-through"
                            : ""
                        }`}
                      >
                        {res.title}
                      </h4>
                      <div className='flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5'>
                        <span className='text-xs opacity-70 font-medium'>
                          {res.duration}
                        </span>
                        <a
                          href={res.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='opacity-80 hover:opacity-100 flex items-center text-xs font-bold uppercase tracking-wide'
                        >
                          Open <ExternalLink size={10} className='ml-1' />
                        </a>

                        {/* Validation Badge */}
                        <div className='flex items-center gap-1.5'>
                          {validationStatuses[res.url] === 'checking' && (
                            <div className='flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase'>
                              <Loader2 size={10} className='animate-spin' />
                              Verifying
                            </div>
                          )}
                          {validationStatuses[res.url] === 'valid' && (
                            <div className='flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase py-0.5 px-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-800/40'>
                              <CheckCircle size={10} />
                              Verified
                            </div>
                          )}
                          {validationStatuses[res.url] === 'invalid' && (
                            <div className='flex items-center gap-1 text-[9px] text-red-600 dark:text-red-400 font-bold uppercase py-0.5 px-1.5 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800/40'>
                              <AlertCircle size={10} />
                              Unavailable
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(!career.resources || career.resources.length === 0) && (
                  <p className='text-sm text-slate-400 text-center py-4'>
                    No specific resources found.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Summary Card */}
            {!isFullyQualified && (
              <div className='bg-brand-600 dark:bg-brand-700 rounded-xl p-6 text-white shadow-lg shadow-brand-200 dark:shadow-none'>
                <h3 className='font-bold text-lg mb-2'>Career Outlook</h3>
                <p className='text-brand-100 text-sm mb-4'>
                  This role requires a mix of technical and soft skills. Your
                  current profile matches {career.matchPercentage}% of the
                  requirements.
                </p>
                <div className='flex items-center text-sm font-medium bg-white/10 p-2 rounded-lg'>
                  <AlertCircle size={16} className='mr-2 text-brand-200' />
                  <span>{missingSkills.length} Key Skills to Learn</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
