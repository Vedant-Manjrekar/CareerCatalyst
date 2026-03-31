import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  ArrowRight,
  Loader2,
  CheckCircle,
  Plus,
  Search,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  extractSkillsFromResume,
  recommendCareers,
} from "../services/geminiService";

export const CareerFinderResume: React.FC = () => {
  const navigate = useNavigate();
  const { updateSkills, setSearchResults } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [newSkill, setNewSkill] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleResumeScan = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(",")[1];
        const mimeType = selectedFile.type;

        // Extract Skills
        const skills = await extractSkillsFromResume(base64String, mimeType);
        setExtractedSkills(skills);
        setStep("review");
        setIsLoading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to analyze resume. Please ensure the file is a readable PDF or Image."
      );
      setIsLoading(false);
    }
  };

  const handleGenerateCareers = async () => {
    if (extractedSkills.length === 0) return;
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(`http://localhost:8000/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: extractedSkills,
        }),
      });

      console.log(extractedSkills);

      updateSkills(extractedSkills);
      const careers = await recommendCareers(extractedSkills);
      setSearchResults(careers);
      navigate("/finder/results");
    } catch (error) {
      console.error(error);
      alert("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setExtractedSkills(
      extractedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const addSkill = () => {
    if (newSkill.trim() && !extractedSkills.includes(newSkill.trim())) {
      setExtractedSkills([...extractedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className='max-w-3xl mx-auto py-10'>
      <div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50'>
        {step === "upload" ? (
          <>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
              Upload your Resume
            </h2>
            <p className='text-slate-500 dark:text-slate-400 mb-8'>
              We'll scan your resume to extract skills and match you with the
              best career paths.
            </p>

            <div className='border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative mb-8'>
              <input
                type='file'
                accept='image/*,application/pdf'
                onChange={handleFileChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                id='file-upload'
              />

              {selectedFile ? (
                <div className='flex flex-col items-center animate-in fade-in zoom-in duration-300'>
                  <div className='w-16 h-16 bg-brand-100 dark:bg-white/5 dark:text-moon-300 rounded-full flex items-center justify-center text-brand-600 mb-3'>
                    <FileText size={32} />
                  </div>
                  <span className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                    {selectedFile.name}
                  </span>
                  <span className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center z-10 relative'
                  >
                    <X size={16} className='mr-1' /> Remove
                  </button>
                </div>
              ) : (
                <div className='flex flex-col items-center pointer-events-none'>
                  <div className='w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 mb-4'>
                    <Upload size={32} />
                  </div>
                  <span className='text-lg font-medium text-brand-600 dark:text-moon-300'>
                    Click to upload
                  </span>
                  <span className='text-slate-400 text-sm mt-1'>
                    or drag and drop PDF/Image
                  </span>
                </div>
              )}
            </div>

            <div className='flex justify-between items-center pt-2'>
              <button
                onClick={() => navigate("/finder")}
                className='text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium px-4 py-2'
              >
                Back
              </button>

              <button
                onClick={handleResumeScan}
                disabled={!selectedFile || isLoading}
                className='px-8 py-3 bg-brand-600 dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 dark:hover:bg-white/10 dark:text-white text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-brand-500/20 dark:shadow-none transition-all active:scale-95'
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className='mr-2 animate-spin' />
                    Scanning...
                  </>
                ) : (
                  <>
                    Analyze Resume <ArrowRight size={18} className='ml-2' />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='flex items-center mb-6'>
              <div className='w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mr-4'>
                <CheckCircle size={20} />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
                  Analysis Complete
                </h2>
                <p className='text-slate-500 dark:text-slate-400'>
                  We found {extractedSkills.length} skills. Review and refine
                  them below.
                </p>
              </div>
            </div>

            {/* Skill Edit Area */}
            <div className='mb-8'>
              <div className='flex items-center border border-slate-300 dark:border-slate-600 rounded-lg p-2 focus-within:ring-2 focus-within:ring-brand-500 dark:focus-within:ring-moon-400 bg-white dark:bg-slate-900/50 mb-4'>
                <Search className='text-slate-400 ml-2' size={20} />
                <input
                  type='text'
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Add missing skill...'
                  className='flex-1 p-2 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 bg-transparent'
                  autoFocus
                />
                <button
                  onClick={addSkill}
                  className='p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md text-slate-600 dark:text-slate-300 transition-colors'
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className='flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-700/20 rounded-xl border border-slate-100 dark:border-slate-700/50 min-h-[100px]'>
                {extractedSkills.length === 0 && (
                  <span className='text-slate-400 text-sm italic w-full text-center py-4'>
                    No skills found. Please add some manually.
                  </span>
                )}
                {extractedSkills.map((skill) => (
                  <span
                    key={skill}
                    className='bg-white dark:bg-white/5 text-brand-700 dark:text-moon-300 px-3 py-1.5 rounded-full text-sm font-medium flex items-center border border-brand-100 dark:border-white/10 shadow-sm animate-in fade-in zoom-in duration-200'
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className='ml-2 text-brand-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none transition-colors'
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className='flex justify-between items-center pt-2'>
              <button
                onClick={() => setStep("upload")}
                className='text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium px-4 py-2'
              >
                Scan Another
              </button>

              <button
                onClick={handleGenerateCareers}
                disabled={extractedSkills.length === 0 || isLoading}
                className='px-8 py-3 bg-brand-600 dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 dark:hover:bg-white/10 dark:text-white text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-brand-500/20 dark:shadow-none transition-all active:scale-95'
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className='mr-2 animate-spin' />
                    Finding Careers...
                  </>
                ) : (
                  <>
                    Find Careers <ArrowRight size={18} className='ml-2' />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {isLoading && step === "upload" && (
        <div className='mt-8 text-center animate-in fade-in'>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            This might take a few seconds...
          </p>
        </div>
      )}
    </div>
  );
};
