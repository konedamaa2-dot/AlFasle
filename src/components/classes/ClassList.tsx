"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Classe } from "@/types";
import {
  FolderKanban,
  PlusCircle,
  Users,
  BookOpen,
  FileCheck2,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { ApplyModal } from "./ApplyModal";

interface ClassListProps {
  onOpenCreateClass: () => void;
  onSelectClassForCourses?: (classId: string) => void;
}

export function ClassList({ onOpenCreateClass, onSelectClassForCourses }: ClassListProps) {
  const { currentUser, classes, inscriptions } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  // Apply modal state
  const [applyingClass, setApplyingClass] = useState<Classe | null>(null);

  const categories = ["ALL", "Informatique", "Mathématiques", "Design", "Sciences", "Langues"];
  const levels = ["ALL", "Débutant", "Intermédiaire", "Avancé"];

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || c.category.includes(selectedCategory);
    const matchesLevel = selectedLevel === "ALL" || c.level === selectedLevel;
    return matchesSearch && matchesCat && matchesLevel;
  });

  const getStudentStatusForClass = (classId: string) => {
    const ins = inscriptions.find((i) => i.classeId === classId && i.userId === currentUser.id);
    return ins ? ins.status : null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {currentUser.role === "TEACHER"
              ? "Gestion des Classes Pédagogiques"
              : "Catalogue des Classes & Formations"}
          </h2>
          <p className="text-xs text-slate-400">
            {currentUser.role === "TEACHER"
              ? "Consultez, éditez et gérez les effectifs de vos promotions"
              : "Explorez les programmes disponibles et inscrivez-vous en ligne"}
          </p>
        </div>

        {currentUser.role === "TEACHER" && (
          <button
            onClick={onOpenCreateClass}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Créer une Nouvelle Classe
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrer par mot-clé, professeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category & Level pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Matière :
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700"
              }`}
            >
              {cat === "ALL" ? "Toutes" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-slate-800">
            <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Aucune classe trouvée</p>
            <p className="text-xs text-slate-500 mt-1">
              Essayez de modifier vos critères de recherche ou créez une nouvelle classe.
            </p>
          </div>
        ) : (
          filteredClasses.map((cls) => {
            const studentStatus = getStudentStatusForClass(cls.id);
            const isFull = (cls.enrolledCount || 0) >= cls.capacity;

            return (
              <div
                key={cls.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between group"
              >
                {/* Image Cover */}
                <div className="h-40 w-full relative overflow-hidden bg-slate-800">
                  <img
                    src={
                      cls.coverImage ||
                      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800"
                    }
                    alt={cls.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Level & Category badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                      {cls.level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      {cls.category}
                    </span>
                  </div>

                  {/* Enrollment mode */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-medium">
                    {cls.enrollmentMode === "MANUAL_APPROVAL" ? "Sur sélection" : "Accès direct"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  {/* Teacher info */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                      👨‍🏫
                    </div>
                    <span className="text-xs text-slate-300 font-medium">{cls.teacherName}</span>
                  </div>

                  {/* Stats & Capacity */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Inscrits :</span>
                      <span className="font-semibold text-slate-200">
                        {cls.enrolledCount || 0} / {cls.capacity} places
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (((cls.enrolledCount || 0) / cls.capacity) * 100) || 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions according to Role */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    {currentUser.role === "TEACHER" || currentUser.role === "ADMIN" ? (
                      <button
                        onClick={() => onSelectClassForCourses && onSelectClassForCourses(cls.id)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Gérer les Cours ({cls.coursesCount || 0})
                      </button>
                    ) : (
                      // Student view
                      <>
                        {studentStatus === "APPROVED" ? (
                          <button
                            onClick={() => onSelectClassForCourses && onSelectClassForCourses(cls.id)}
                            className="w-full py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Accéder à la Classe
                          </button>
                        ) : studentStatus === "PENDING" ? (
                          <div className="w-full py-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center justify-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                            Préinscription en attente
                          </div>
                        ) : studentStatus === "REJECTED" ? (
                          <div className="w-full py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-medium text-center">
                            Demande non retenue
                          </div>
                        ) : (
                          <button
                            disabled={isFull}
                            onClick={() => setApplyingClass(cls)}
                            className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                              isFull
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                            }`}
                          >
                            <Send className="w-3.5 h-3.5" />
                            {isFull ? "Classe Complète" : "Se Préinscrire"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Student Apply Modal */}
      <ApplyModal
        targetClass={applyingClass}
        isOpen={!!applyingClass}
        onClose={() => setApplyingClass(null)}
      />
    </div>
  );
}
