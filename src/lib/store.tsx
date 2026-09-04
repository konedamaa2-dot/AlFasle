"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Classe,
  Inscription,
  Cours,
  Devoir,
  Soumission,
  Correction,
  AppNotification,
} from "@/types";
import {
  initialUsers,
  initialClasses,
  initialInscriptions,
  initialCourses,
  initialAssignments,
  initialSubmissions,
  initialNotifications,
} from "./mock-data";

interface StoreContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  switchRole: (role: UserRole) => void;

  // Classes
  classes: Classe[];
  createClass: (newClass: Omit<Classe, "id" | "createdAt" | "teacherId" | "teacherName" | "enrolledCount" | "pendingCount">) => Classe;
  updateClass: (id: string, data: Partial<Classe>) => void;
  archiveClass: (id: string) => void;

  // Inscriptions
  inscriptions: Inscription[];
  applyToClass: (classeId: string, motivation?: string) => void;
  approveInscription: (inscriptionId: string) => void;
  rejectInscription: (inscriptionId: string) => void;

  // Courses
  courses: Cours[];
  createCourse: (newCourse: Omit<Cours, "id" | "publishedAt">) => void;
  updateCourse: (id: string, data: Partial<Cours>) => void;
  deleteCourse: (id: string) => void;

  // Assignments
  assignments: Devoir[];
  createAssignment: (newAssignment: Omit<Devoir, "id" | "createdAt" | "submissionsCount" | "gradedCount">) => void;
  deleteAssignment: (id: string) => void;

  // Submissions & Corrections
  submissions: Soumission[];
  submitAssignment: (devoirId: string, content: string, attachmentName?: string) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [users] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default: Teacher Sarah

  const [classes, setClasses] = useState<Classe[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alfasle_classes");
      if (saved) return JSON.parse(saved);
    }
    return initialClasses;
  });

  const [inscriptions, setInscriptions] = useState<Inscription[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alfasle_inscriptions");
      if (saved) return JSON.parse(saved);
    }
    return initialInscriptions;
  });

  const [courses, setCourses] = useState<Cours[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alfasle_courses");
      if (saved) return JSON.parse(saved);
    }
    return initialCourses;
  });

  const [assignments, setAssignments] = useState<Devoir[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alfasle_assignments");
      if (saved) return JSON.parse(saved);
    }
    return initialAssignments;
  });

  const [submissions, setSubmissions] = useState<Soumission[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alfasle_submissions");
      if (saved) return JSON.parse(saved);
    }
    return initialSubmissions;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alfasle_notifications");
      if (saved) return JSON.parse(saved);
    }
    return initialNotifications;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("alfasle_classes", JSON.stringify(classes));
      localStorage.setItem("alfasle_inscriptions", JSON.stringify(inscriptions));
      localStorage.setItem("alfasle_courses", JSON.stringify(courses));
      localStorage.setItem("alfasle_assignments", JSON.stringify(assignments));
      localStorage.setItem("alfasle_submissions", JSON.stringify(submissions));
      localStorage.setItem("alfasle_notifications", JSON.stringify(notifications));
    }
  }, [classes, inscriptions, courses, assignments, submissions, notifications]);

  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) setCurrentUser(found);
  };

  // Class Management
  const createClass = (newClassData: Omit<Classe, "id" | "createdAt" | "teacherId" | "teacherName" | "enrolledCount" | "pendingCount">) => {
    const newClass: Classe = {
      ...newClassData,
      id: `cls_${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      createdAt: new Date().toISOString(),
      enrolledCount: 0,
      pendingCount: 0,
      coursesCount: 0,
      assignmentsCount: 0,
    };
    setClasses((prev) => [newClass, ...prev]);

    // Notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: "Nouvelle classe créée",
      message: `Votre classe « ${newClass.title} » est maintenant active.`,
      type: "SYSTEM",
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return newClass;
  };

  const updateClass = (id: string, data: Partial<Classe>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const archiveClass = (id: string) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status: "ARCHIVED" } : c)));
  };

  // Inscriptions
  const applyToClass = (classeId: string, motivation?: string) => {
    const targetClass = classes.find((c) => c.id === classeId);
    if (!targetClass) return;

    // Check if already applied
    const existing = inscriptions.find((i) => i.classeId === classeId && i.userId === currentUser.id);
    if (existing) return;

    const isAutoApprove = targetClass.enrollmentMode === "OPEN";

    const newInscription: Inscription = {
      id: `ins_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatarUrl,
      classeId,
      classeTitle: targetClass.title,
      status: isAutoApprove ? "APPROVED" : "PENDING",
      motivation: motivation || "Candidature via le portail étudiant AlFasle",
      appliedAt: new Date().toISOString(),
      reviewedAt: isAutoApprove ? new Date().toISOString() : undefined,
    };

    setInscriptions((prev) => [newInscription, ...prev]);

    // Update class counters
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === classeId) {
          return {
            ...c,
            enrolledCount: isAutoApprove ? (c.enrolledCount || 0) + 1 : c.enrolledCount,
            pendingCount: !isAutoApprove ? (c.pendingCount || 0) + 1 : c.pendingCount,
          };
        }
        return c;
      })
    );

    // Notify teacher
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: targetClass.teacherId,
        title: isAutoApprove ? "Nouvel étudiant inscrit" : "Nouvelle préinscription",
        message: `${currentUser.name} a rejoint ${targetClass.title}${!isAutoApprove ? " (en attente de validation)" : ""}.`,
        type: "INSCRIPTION",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const approveInscription = (inscriptionId: string) => {
    setInscriptions((prev) =>
      prev.map((ins) => {
        if (ins.id === inscriptionId) {
          // Notify student
          setNotifications((n) => [
            {
              id: `notif_${Date.now()}`,
              userId: ins.userId,
              title: "Préinscription validée 🎉",
              message: `Votre demande pour la classe « ${ins.classeTitle} » a été acceptée !`,
              type: "INSCRIPTION",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            ...n,
          ]);

          // Update class counters
          setClasses((cls) =>
            cls.map((c) =>
              c.id === ins.classeId
                ? {
                    ...c,
                    enrolledCount: (c.enrolledCount || 0) + 1,
                    pendingCount: Math.max(0, (c.pendingCount || 1) - 1),
                  }
                : c
            )
          );

          return { ...ins, status: "APPROVED", reviewedAt: new Date().toISOString() };
        }
        return ins;
      })
    );
  };

  const rejectInscription = (inscriptionId: string) => {
    setInscriptions((prev) =>
      prev.map((ins) => {
        if (ins.id === inscriptionId) {
          setClasses((cls) =>
            cls.map((c) =>
              c.id === ins.classeId
                ? { ...c, pendingCount: Math.max(0, (c.pendingCount || 1) - 1) }
                : c
            )
          );
          return { ...ins, status: "REJECTED", reviewedAt: new Date().toISOString() };
        }
        return ins;
      })
    );
  };

  // Courses
  const createCourse = (newCourseData: Omit<Cours, "id" | "publishedAt">) => {
    const newCourse: Cours = {
      ...newCourseData,
      id: `crs_${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    setCourses((prev) => [...prev, newCourse]);

    setClasses((cls) =>
      cls.map((c) =>
        c.id === newCourseData.classeId
          ? { ...c, coursesCount: (c.coursesCount || 0) + 1 }
          : c
      )
    );
  };

  const updateCourse = (id: string, data: Partial<Cours>) => {
    setCourses((prev) => prev.map((crs) => (crs.id === id ? { ...crs, ...data } : crs)));
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((crs) => crs.id !== id));
  };

  // Assignments
  const createAssignment = (newAssignmentData: Omit<Devoir, "id" | "createdAt" | "submissionsCount" | "gradedCount">) => {
    const newAssignment: Devoir = {
      ...newAssignmentData,
      id: `dev_${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissionsCount: 0,
      gradedCount: 0,
    };
    setAssignments((prev) => [newAssignment, ...prev]);

    setClasses((cls) =>
      cls.map((c) =>
        c.id === newAssignmentData.classeId
          ? { ...c, assignmentsCount: (c.assignmentsCount || 0) + 1 }
          : c
      )
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Submissions & Grading
  const submitAssignment = (devoirId: string, content: string, attachmentName?: string) => {
    const assignment = assignments.find((a) => a.id === devoirId);
    if (!assignment) return;

    const targetClass = classes.find((c) => c.id === assignment.classeId);

    const isLate = new Date() > new Date(assignment.dueDate);

    const newSub: Soumission = {
      id: `sub_${Date.now()}`,
      devoirId,
      devoirTitle: assignment.title,
      classeId: assignment.classeId,
      classeTitle: targetClass?.title || "Classe",
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentAvatar: currentUser.avatarUrl,
      content,
      attachmentName: attachmentName || "devoir_rendu.pdf",
      attachmentUrl: "#",
      submittedAt: new Date().toISOString(),
      status: isLate ? "LATE" : "SUBMITTED",
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // Update assignment counter
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === devoirId
          ? { ...a, submissionsCount: (a.submissionsCount || 0) + 1 }
          : a
      )
    );

    // Notify teacher
    if (targetClass) {
      setNotifications((n) => [
        {
          id: `notif_${Date.now()}`,
          userId: targetClass.teacherId,
          title: "Nouveau devoir soumis 📝",
          message: `${currentUser.name} a déposé son travail pour « ${assignment.title} ».`,
          type: "ASSIGNMENT",
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...n,
      ]);
    }
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          const correction: Correction = {
            id: `cor_${Date.now()}`,
            soumissionId: sub.id,
            graderId: currentUser.id,
            graderName: currentUser.name,
            score,
            maxScore: 20,
            feedback,
            gradedAt: new Date().toISOString(),
          };

          // Update assignment graded counter
          setAssignments((as) =>
            as.map((a) =>
              a.id === sub.devoirId
                ? { ...a, gradedCount: (a.gradedCount || 0) + 1 }
                : a
            )
          );

          // Notify student
          setNotifications((n) => [
            {
              id: `notif_${Date.now()}`,
              userId: sub.studentId,
              title: "Devoir corrigé et noté 🎓",
              message: `Votre note pour « ${sub.devoirTitle} » est de ${score}/20.`,
              type: "GRADE",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            ...n,
          ]);

          return {
            ...sub,
            status: "GRADED",
            correction,
          };
        }
        return sub;
      })
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        switchRole,
        classes,
        createClass,
        updateClass,
        archiveClass,
        inscriptions,
        applyToClass,
        approveInscription,
        rejectInscription,
        courses,
        createCourse,
        updateCourse,
        deleteCourse,
        assignments,
        createAssignment,
        deleteAssignment,
        submissions,
        submitAssignment,
        gradeSubmission,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
