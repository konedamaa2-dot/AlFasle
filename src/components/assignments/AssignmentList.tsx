"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Devoir, Soumission } from "@/types";
import {
  FileCheck2,
  PlusCircle,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Users,
  Search,
  ChevronRight,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { GradingModal } from "./GradingModal";
import { SubmitAssignmentModal } from "./SubmitAssignmentModal";

interface AssignmentListProps {
  onOpenCreateAssignment: () => void;
}

export function AssignmentList({ onOpenCreateAssignment }: AssignmentListProps) {
  const { currentUser, assignments, submissions, classes } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("ALL");

  // Modals state
  const [selectedSubmissionForGrade, setSelectedSubmissionForGrade] =
    useState<Soumission | null>(null);
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] =
    useState<Devoir | null>(null);

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassId === "ALL" || a.classeId === selectedClassId;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {currentUser.role === "TEACHER"
              ? "Gestion des Devoirs & Évaluations"
              : "Mes Devoirs & Projets Pratiques"}
          </h2>
          <p className="text-xs text-slate-400">
            {currentUser.role === "TEACHER"
              ? "Publiez des sujets, suivez les remises de copies et attribuez les notes"
              : "Consultez les consignes, déposez vos travaux et découvrez vos notes"}
          </p>
        </div>

        {currentUser.role === "TEACHER" && (
          <button
            onClick={onOpenCreateAssignment}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Devoir
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher un devoir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-slate-400">Filtrer par classe :</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Toutes les classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List of Assignments */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800">
            <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Aucun devoir programmé</p>
            <p className="text-xs text-slate-500 mt-1">
              Les devoirs et travaux pratiques apparaîtront ici.
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const assignmentClass = classes.find((c) => c.id === assignment.classeId);
            const assignmentSubmissions = submissions.filter((s) => s.devoirId === assignment.id);
            const mySubmission = submissions.find(
              (s) => s.devoirId === assignment.id && s.studentId === currentUser.id
            );

            const isPastDue = new Date() > new Date(assignment.dueDate);

            return (
              <div
                key={assignment.id}
                className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-all"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                        {assignmentClass?.title || "Classe"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Limite : {formatDateTime(assignment.dueDate)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-semibold">
                        Barème : /{assignment.maxScore} pts
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {assignment.title}
                    </h3>
                  </div>

                  {/* Student Submission Button if student */}
                  {currentUser.role === "STUDENT" && (
                    <div className="shrink-0 self-end sm:self-start">
                      {mySubmission ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Devoir Rendu
                          {mySubmission.correction && (
                            <span className="ml-1 px-2 py-0.5 rounded bg-emerald-500/30 font-black">
                              {mySubmission.correction.score}/20
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedAssignmentForSubmit(assignment)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Rendre mon Devoir
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
                  {assignment.instructions}
                </div>

                {/* Teacher view: list of student submissions for this assignment */}
                {currentUser.role === "TEACHER" && (
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        Copies des étudiants ({assignmentSubmissions.length} reçue
                        {assignmentSubmissions.length > 1 ? "s" : ""})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {assignmentSubmissions.filter((s) => s.status === "GRADED").length} corrigée
                        {assignmentSubmissions.filter((s) => s.status === "GRADED").length > 1
                          ? "s"
                          : ""}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {assignmentSubmissions.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2">
                          Aucun étudiant n'a encore remis sa copie pour ce devoir.
                        </p>
                      ) : (
                        assignmentSubmissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  sub.studentAvatar ||
                                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                                }
                                alt={sub.studentName}
                                className="w-7 h-7 rounded-full object-cover border border-slate-700"
                              />
                              <div>
                                <span className="font-semibold text-white">{sub.studentName}</span>
                                <span className="text-[10px] text-slate-400 block">
                                  Rendu le {formatDateTime(sub.submittedAt)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {sub.status === "GRADED" ? (
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs">
                                    {sub.correction?.score} / 20
                                  </span>
                                  <button
                                    onClick={() => setSelectedSubmissionForGrade(sub)}
                                    className="text-[11px] text-slate-400 hover:text-white"
                                  >
                                    Modifier
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSelectedSubmissionForGrade(sub)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                                >
                                  Corriger & Noter
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <GradingModal
        submission={selectedSubmissionForGrade}
        isOpen={!!selectedSubmissionForGrade}
        onClose={() => setSelectedSubmissionForGrade(null)}
      />

      <SubmitAssignmentModal
        assignment={selectedAssignmentForSubmit}
        isOpen={!!selectedAssignmentForSubmit}
        onClose={() => setSelectedAssignmentForSubmit(null)}
      />
    </div>
  );
}
