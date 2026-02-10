import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, X, Plus, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { recommendCareers } from "../services/geminiService";

const COMMON_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "Java",
  "C++",
  "SQL",
  "Project Management",
  "Public Speaking",
  "Data Analysis",
  "Excel",
  "Photoshop",
  "Figma",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Git",
  "Agile",
  "Scrum",
  "HTML",
  "CSS",
  "TypeScript",
  "Go",
  "Rust",
  "Sales",
  "Marketing",
  "Accounting",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Time Management",
  "Customer Service",
  "Writing",
  "Research",
  "Social Media",
  "SEO",
  "Product Management",
  "UX Design",
];

export const CareerFinderManual: React.FC = () => {
  const navigate = useNavigate();
  const { updateSkills, setSearchResults } = useApp();

  const [inputValue, setInputValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = COMMON_SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !selectedSkills.includes(skill)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setInputValue("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkill(inputValue.trim());
      }
    }
  };

  const handleAnalyze = async () => {
    if (selectedSkills.length === 0) return;

    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(`http://localhost:8000/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: selectedSkills,
        }),
      });

      updateSkills(selectedSkills);
      const careers = await recommendCareers(selectedSkills);
      setSearchResults(careers);
      navigate("/finder/results");
    } catch (error) {
      console.error(error);
      alert("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto py-10'>
      <div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 transition-colors duration-300'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
          What skills do you have?
        </h2>
        <p className='text-slate-500 dark:text-slate-400 mb-6'>
          Enter your professional skills, tools, and technologies.
        </p>

        {/* Input Area */}
        <div className='relative mb-6' ref={wrapperRef}>
          <div className='flex items-center border border-slate-300 dark:border-slate-600 rounded-lg p-2 focus-within:ring-2 focus-within:ring-brand-500 dark:focus-within:ring-moon-400 bg-white dark:bg-slate-900/50'>
            <Search className='text-slate-400 ml-2' size={20} />
            <input
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue && setShowSuggestions(true)}
              placeholder='Type a skill (e.g. React, Excel)...'
              className='flex-1 p-3 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 bg-transparent'
              autoFocus
            />
            {inputValue && (
              <button
                onClick={() => addSkill(inputValue)}
                className='mr-2 p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md text-slate-600 dark:text-slate-300 transition-colors'
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-50 max-h-60 overflow-y-auto'>
              {suggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className='w-full text-left px-4 py-3 hover:bg-brand-50 dark:hover:bg-white/5 hover:text-brand-700 dark:hover:text-moon-300 text-slate-700 dark:text-slate-200 transition-colors flex justify-between items-center group'
                >
                  {skill}
                  <Plus
                    size={16}
                    className='opacity-0 group-hover:opacity-100 text-brand-500 dark:text-moon-400'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Tags */}
        <div className='flex flex-wrap gap-2 mb-8 min-h-[40px]'>
          {selectedSkills.length === 0 && (
            <span className='text-slate-400 text-sm italic'>
              No skills added yet.
            </span>
          )}
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className='bg-brand-50 dark:bg-moon-900/20 text-brand-700 dark:text-moon-300 px-3 py-1.5 rounded-full text-sm font-medium flex items-center border border-brand-100 dark:border-moon-900/30 animate-in fade-in zoom-in duration-200'
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className='ml-2 hover:text-brand-900 dark:hover:text-white focus:outline-none'
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-700/50'>
          <button
            onClick={() => navigate("/finder")}
            className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium px-4 py-2'
          >
            Back
          </button>

          <button
            onClick={handleAnalyze}
            disabled={selectedSkills.length === 0 || isLoading}
            className='px-8 py-3 bg-brand-600 dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 dark:hover:bg-white/10 dark:text-white text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-brand-500/20 dark:shadow-none transition-all active:scale-95'
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className='mr-2 animate-spin' />
                Analyzing...
              </>
            ) : (
              <>
                Find Careers <ArrowRight size={18} className='ml-2' />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
