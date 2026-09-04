"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { ClassList } from "@/components/classes/ClassList";
import { CreateClassModal } from "@/components/classes/CreateClassModal";
import { ValidationQueue } from "@/components/inscriptions/ValidationQueue";
import { CourseViewer } from "@/components/courses/CourseViewer";
import { CreateCourseModal } from "@/components/courses/CreateCourseModal";
import { AssignmentList } from "@/components/assignments/AssignmentList";
import { CreateAssignmentModal } from "@/components/assignments/CreateAssignmentModal";
import { SubmitAssignmentModal } from "@/components/assignments/SubmitAssignmentModal";
import { GradingModal } from "@/components/assignments/GradingModal";
import { GradebookView } from "@/components/grades/GradebookView";
import { Soumission, Devoir } from "@/types";

export default function Home() {
  const { currentUser, submissions, assignments } = useStore();
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");

  // Modals state
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);

  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] =
    useState<Soumission | null>(null);
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] =
    useState<Devoir | null>(null);
  const [selectedClassForCourses, setSelectedClassForCourses] = useState<string | undefined>(
    undefined
  );

  const handleOpenGrading = (subId: string) => {
    const found = submissions.find((s) => s.id === subId);
    if (found) setSelectedSubmissionForGrading(found);
  };

  const handleOpenSubmitAssignment = (assignmentId: string) => {
    const found = assignments.find((a) => a.id === assignmentId);
    if (found) setSelectedAssignmentForSubmit(found);
  };

  const handleSelectClassForCourses = (classId: string) => {
    setSelectedClassForCourses(classId);
    setActiveTab("courses");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
          {activeTab === "dashboard" && (
            <>
              {currentUser.role === "TEACHER" || currentUser.role === "ADMIN" ? (
                <TeacherDashboard
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenCreateClass={() => setIsCreateClassOpen(true)}
                  onOpenCreateCourse={() => setIsCreateCourseOpen(true)}
                  onOpenCreateAssignment={() => setIsCreateAssignmentOpen(true)}
                  onSelectSubmissionForGrading={handleOpenGrading}
                />
              ) : (
                <StudentDashboard
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenSubmitAssignment={handleOpenSubmitAssignment}
                  onSelectCourse={(cId) => setActiveTab("courses")}
                />
              )}
            </>
          )}

          {activeTab === "classes" && (
            <ClassList
              onOpenCreateClass={() => setIsCreateClassOpen(true)}
              onSelectClassForCourses={handleSelectClassForCourses}
            />
          )}

          {activeTab === "catalog" && (
            <ClassList
              onOpenCreateClass={() => setIsCreateClassOpen(true)}
              onSelectClassForCourses={handleSelectClassForCourses}
            />
          )}

          {activeTab === "inscriptions" && <ValidationQueue />}

          {activeTab === "courses" && (
            <CourseViewer
              onOpenCreateCourse={() => setIsCreateCourseOpen(true)}
              selectedClassId={selectedClassForCourses}
            />
          )}

          {activeTab === "assignments" && (
            <AssignmentList
              onOpenCreateAssignment={() => setIsCreateAssignmentOpen(true)}
            />
          )}

          {(activeTab === "grades" || activeTab === "analytics") && <GradebookView />}

          {activeTab === "settings" && (
            <div className="glass-panel rounded-2xl p-8 border border-slate-800 space-y-4 max-w-2xl">
              <h2 className="text-xl font-bold text-white">Paramètres de la Plateforme</h2>
              <p className="text-xs text-slate-400">
                Configurez les options globales de la plateforme AlFasle, les notifications
                automatiques et les intégrations de stockage.
              </p>
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <p className="font-semibold text-white">Notifications par Email</p>
                    <p className="text-slate-400">Alerter lors des nouvelles préinscriptions</p>
                  </div>
                  <span className="text-emerald-400 font-bold">Activé</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <p className="font-semibold text-white">Service de Streaming Vidéo</p>
                    <p className="text-slate-400">Encodage Mux / Bunny.net / Cloudflare Stream</p>
                  </div>
                  <span className="text-indigo-400 font-bold">Connecté</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CreateClassModal
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
      />

      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
      />

      <CreateAssignmentModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
      />

      <GradingModal
        submission={selectedSubmissionForGrading}
        isOpen={!!selectedSubmissionForGrading}
        onClose={() => setSelectedSubmissionForGrading(null)}
      />

      <SubmitAssignmentModal
        assignment={selectedAssignmentForSubmit}
        isOpen={!!selectedAssignmentForSubmit}
        onClose={() => setSelectedAssignmentForSubmit(null)}
      />
    </div>
  );
}
